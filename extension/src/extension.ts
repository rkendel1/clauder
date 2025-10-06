import * as vscode from "vscode"
import { ExtensionProvider } from "./providers/extension-provider"
import { amplitudeTracker } from "./utils/amplitude"
import * as path from "path"
import { extensionName } from "./shared/constants"
import "./utils/path-helpers"
import {
	DIFF_VIEW_URI_SCHEME,
	INLINE_DIFF_VIEW_URI_SCHEME,
	INLINE_MODIFIED_URI_SCHEME,
	MODIFIED_URI_SCHEME,
} from "./integrations/editor/decoration-controller"
import { PromptStateManager } from "./providers/state/prompt-state-manager"
import DB from "./db"
import { OpenRouterModelCache } from "./api/providers/config/openrouter-cache"
import { SecretStateManager } from "./providers/state/secret-state-manager"
import { GlobalStateManager } from "./providers/state/global-state-manager"
import { BrowserInspectorManager } from "./browser-inspector/browser-inspector-manager"

/*
Built using https://github.com/microsoft/vscode-webview-ui-toolkit

Inspired by
https://github.com/microsoft/vscode-webview-ui-toolkit-samples/tree/main/default/weather-webview
https://github.com/microsoft/vscode-webview-ui-toolkit-samples/tree/main/frameworks/hello-world-react-cra

*/
// 🧩 TASK FOR COPILOT:
// Enhance this VS Code extension to include a fully interactive browser panel inside VS Code.
// The panel should:
//
// 1. Create a WebView panel named "Browser Inspector" that loads http://localhost:3000 by default.
//    - The URL should be configurable (allow user input or setting).
//    - Use enableScripts: true and appropriate localResourceRoots.
//
// 2. Inside the WebView, inject an <iframe> that shows the live web app (the "browser" view).
//    - Overlay a click listener inside the iframe that detects user clicks on elements.
//    - When the user clicks on an element, capture:
//        - The tag name
//        - The CSS selector (smartly generated, like "button.primary" or "div#root > span")
//        - Any "data-component" attribute if present.
//    - Send that data to the extension backend using postMessage.
//
// 3. In the extension backend (TypeScript), listen for postMessage events with type: "elementSelected".
//    - When received, run this VS Code command:
//        vscode.commands.executeCommand("claude.chat", `Explain this component: ${selector}`);
//      OR if Claude is unavailable, log the element selector and tag to the VS Code output console.
//
// 4. Add a command palette entry:
//        Command ID: "extension.openBrowserInspector"
//        Title: "Open Browser Inspector"
//    - When triggered, open or reveal the WebView panel beside the current editor.
//
// 5. Add a simple toolbar or toggle button inside the WebView labeled “Inspect Mode”.
//    - When Inspect Mode is active:
//        - Highlight hovered elements with an outline.
//        - Clicking sends the element info back to VS Code (as above).
//
// 6. Include a helper function to generate CSS selectors for elements based on their hierarchy and attributes.
//
// 🧠 OPTIONAL:
// - Add a text input in the panel header to let the user change the iframe URL dynamically.
// - Make the extension smart enough to reuse the same WebView if it’s already open.
// - Use async/await properly for command handling and event listeners.
//
// ✅ Goal: Make this behave like a mini embedded browser that can talk to Claude (Anthropic) or Copilot
//    when the user clicks on a UI component. 
//    The user should be able to ask the AI about the selected element’s purpose or code source.
//
// Please generate the complete TypeScript code to implement this feature in the existing extension.
// Include necessary command registration, WebView setup, HTML injection, and message passing.



let outputChannel: vscode.OutputChannel

function handleFirstInstall(context: vscode.ExtensionContext) {
	const isFirstInstall = context.globalState.get("isFirstInstall", true)
	console.log(`Extension is first install (isFirstInstall=${isFirstInstall})`)
	if (isFirstInstall) {
		context.globalState.update("isFirstInstall", false)
		amplitudeTracker.extensionActivateSuccess(!!isFirstInstall)
	}
}

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	console.log(`Current time of activation: ${new Date().toLocaleTimeString()}`)
	const getCurrentUser = () => {
		return context.globalState.get("user") as { email: string; credits: number; id: string } | undefined
	}
	OpenRouterModelCache.getInstance(context)

	// DB.init(path.join(context.globalStorageUri.fsPath, "db", "kuhmpel.db"), context)

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	//console.log('Congratulations, your extension "Kuhmpel" is now active!')
	outputChannel = vscode.window.createOutputChannel("Kuhmpel")
	const user = getCurrentUser()
	const version = context.extension.packageJSON.version ?? "0.0.0"
	amplitudeTracker
		.initialize(context.globalState, !!user, vscode.env.sessionId, context.extension.id, version, user?.id)
		.then(() => {
			handleFirstInstall(context)
		})
	outputChannel.appendLine("Kuhmpel extension activated")
	const sidebarProvider = new ExtensionProvider(context, outputChannel)
	context.subscriptions.push(outputChannel)
	console.log(`Kuhmpel extension activated`)

	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider(ExtensionProvider.sideBarId, sidebarProvider, {
			webviewOptions: { retainContextWhenHidden: true },
		})
	)

	context.subscriptions.push(
		vscode.commands.registerCommand(`${extensionName}.plusButtonTapped`, async () => {
			outputChannel.appendLine("Plus button tapped")
			await sidebarProvider?.getTaskManager().clearTask()
			await sidebarProvider?.getWebviewManager().postBaseStateToWebview()
			await sidebarProvider?.getWebviewManager().postClaudeMessagesToWebview([])
			await sidebarProvider
				?.getWebviewManager()
				.postMessageToWebview({ type: "action", action: "chatButtonTapped" })
		})
	)

	const openExtensionInNewTab = async () => {
		outputChannel.appendLine("Opening Kuhmpel in new tab")
		// (this example uses webviewProvider activation event which is necessary to deserialize cached webview, but since we use retainContextWhenHidden, we don't need to use that event)
		// https://github.com/microsoft/vscode-extension-samples/blob/main/webview-sample/src/extension.ts
		const tabProvider = new ExtensionProvider(context, outputChannel)
		//const column = vscode.window.activeTextEditor ? vscode.window.activeTextEditor.viewColumn : undefined
		const lastCol = Math.max(...vscode.window.visibleTextEditors.map((editor) => editor.viewColumn || 0))
		const targetCol = Math.max(lastCol + 1, 1)
		const panel = vscode.window.createWebviewPanel(ExtensionProvider.tabPanelId, "Kuhmpel", targetCol, {
			enableScripts: true,
			retainContextWhenHidden: true,
			localResourceRoots: [context.extensionUri],
		})
		// Check if there are any visible text editors, otherwise open a new group to the right
		const hasVisibleEditors = vscode.window.visibleTextEditors.length > 0
		if (!hasVisibleEditors) {
			await vscode.commands.executeCommand("workbench.action.newGroupRight")
		}
		// TODO: use better svg icon with light and dark variants (see https://stackoverflow.com/questions/58365687/vscode-extension-iconpath)
		panel.iconPath = vscode.Uri.joinPath(context.extensionUri, "assets/icon.png")
		tabProvider.resolveWebviewView(panel)
		console.log("Opened Kuhmpel in new tab")

		// Lock the editor group so clicking on files doesn't open over the panel
		new Promise((resolve) => setTimeout(resolve, 100)).then(() => {
			vscode.commands.executeCommand("workbench.action.lockEditorGroup")
		})
	}
	PromptStateManager.init(context)

	context.subscriptions.push(
		vscode.commands.registerCommand(`${extensionName}.popoutButtonTapped`, openExtensionInNewTab)
	)
	context.subscriptions.push(vscode.commands.registerCommand(`${extensionName}.openInNewTab`, openExtensionInNewTab))

	context.subscriptions.push(
		vscode.commands.registerCommand(`${extensionName}.settingsButtonTapped`, () => {
			//const message = "kodu-claude-coder-main.settingsButtonTapped!"
			//vscode.window.showInformationMessage(message)
			sidebarProvider
				?.getWebviewManager()
				?.postMessageToWebview({ type: "action", action: "settingsButtonTapped" })
		})
	)

	context.subscriptions.push(
		vscode.commands.registerCommand(`${extensionName}.historyButtonTapped`, () => {
			sidebarProvider
				?.getWebviewManager()
				?.postMessageToWebview({ type: "action", action: "historyButtonTapped" })
		})
	)

	// Register Browser Inspector command
	context.subscriptions.push(
		vscode.commands.registerCommand("extension.openBrowserInspector", async () => {
			const browserInspector = BrowserInspectorManager.getInstance(context, outputChannel)
			await browserInspector.openBrowserInspector()
		})
	)

	/*
	We use the text document content provider API to show a diff view for new files/edits by creating a virtual document for the new content.

	- This API allows you to create readonly documents in VSCode from arbitrary sources, and works by claiming an uri-scheme for which your provider then returns text contents. The scheme must be provided when registering a provider and cannot change afterwards.
	- Note how the provider doesn't create uris for virtual documents - its role is to provide contents given such an uri. In return, content providers are wired into the open document logic so that providers are always considered.
	https://code.visualstudio.com/api/extension-guides/virtual-documents
	*/
	const diffContentProvider = new (class implements vscode.TextDocumentContentProvider {
		provideTextDocumentContent(uri: vscode.Uri): string {
			return Buffer.from(uri.query, "base64").toString("utf-8")
		}
	})()

	const modifiedContentProvider = new (class implements vscode.TextDocumentContentProvider {
		private content = new Map<string, string>()

		provideTextDocumentContent(uri: vscode.Uri): string {
			return this.content.get(uri.toString()) || ""
		}

		// Method to update content
		updateContent(uri: vscode.Uri, content: string) {
			this.content.set(uri.toString(), content)
			this._onDidChange.fire(uri)
		}

		private _onDidChange = new vscode.EventEmitter<vscode.Uri>()
		onDidChange = this._onDidChange.event
	})()

	const inlineDiffContentProvider = new (class implements vscode.TextDocumentContentProvider {
		provideTextDocumentContent(uri: vscode.Uri): string {
			return Buffer.from(uri.query, "base64").toString("utf-8")
		}
	})()

	const inlineModifiedContentProvider = new (class implements vscode.TextDocumentContentProvider {
		private content = new Map<string, string>()

		provideTextDocumentContent(uri: vscode.Uri): string {
			return this.content.get(uri.toString()) || ""
		}

		// Method to update content
		updateContent(uri: vscode.Uri, content: string) {
			this.content.set(uri.toString(), content)
			this._onDidChange.fire(uri)
		}

		private _onDidChange = new vscode.EventEmitter<vscode.Uri>()
		onDidChange = this._onDidChange.event
	})()
	vscode.workspace.registerTextDocumentContentProvider(DIFF_VIEW_URI_SCHEME, diffContentProvider),
		vscode.workspace.registerTextDocumentContentProvider(MODIFIED_URI_SCHEME, modifiedContentProvider)
	vscode.workspace.registerTextDocumentContentProvider(INLINE_DIFF_VIEW_URI_SCHEME, inlineDiffContentProvider),
		vscode.workspace.registerTextDocumentContentProvider(INLINE_MODIFIED_URI_SCHEME, inlineModifiedContentProvider)
}

// This method is called when your extension is deactivated
export function deactivate() {
	DB.disconnect()
	outputChannel.appendLine("Kuhmpel extension deactivated")
}
