import * as vscode from "vscode"

/**
 * Manages the Browser Inspector WebView panel
 * Provides functionality to inspect web applications running in an iframe
 */
export class BrowserInspectorManager {
	private static instance: BrowserInspectorManager | undefined
	private panel: vscode.WebviewPanel | undefined
	private outputChannel: vscode.OutputChannel
	private currentUrl: string = "http://localhost:3000"

	private constructor(
		private context: vscode.ExtensionContext,
		outputChannel: vscode.OutputChannel
	) {
		this.outputChannel = outputChannel
	}

	/**
	 * Get or create the singleton instance
	 */
	public static getInstance(
		context: vscode.ExtensionContext,
		outputChannel: vscode.OutputChannel
	): BrowserInspectorManager {
		if (!BrowserInspectorManager.instance) {
			BrowserInspectorManager.instance = new BrowserInspectorManager(context, outputChannel)
		}
		return BrowserInspectorManager.instance
	}

	/**
	 * Open or reveal the Browser Inspector panel
	 */
	public async openBrowserInspector(): Promise<void> {
		// If panel already exists, reveal it
		if (this.panel) {
			this.panel.reveal(vscode.ViewColumn.Beside)
			return
		}

		// Create new panel
		this.panel = vscode.window.createWebviewPanel(
			"browserInspector",
			"Browser Inspector",
			vscode.ViewColumn.Beside,
			{
				enableScripts: true,
				retainContextWhenHidden: true,
				localResourceRoots: [this.context.extensionUri],
			}
		)

		// Set the panel icon
		this.panel.iconPath = vscode.Uri.joinPath(this.context.extensionUri, "assets/icon.png")

		// Set up the webview content
		this.panel.webview.html = this.getWebviewContent()

		// Set up message listener
		this.setupMessageListener()

		// Handle panel disposal
		this.panel.onDidDispose(() => {
			this.panel = undefined
		})

		this.outputChannel.appendLine("Browser Inspector panel opened")
	}

	/**
	 * Set up message listener for webview communication
	 */
	private setupMessageListener(): void {
		if (!this.panel) return

		this.panel.webview.onDidReceiveMessage(
			async (message) => {
				switch (message.type) {
					case "elementSelected":
						await this.handleElementSelected(message.data)
						break
					case "urlChange":
						this.currentUrl = message.url
						this.outputChannel.appendLine(`URL changed to: ${this.currentUrl}`)
						break
					case "ready":
						this.outputChannel.appendLine("Browser Inspector webview ready")
						break
				}
			},
			undefined,
			this.context.subscriptions
		)
	}

	/**
	 * Handle element selection from the webview
	 */
	private async handleElementSelected(data: {
		tagName: string
		selector: string
		dataComponent?: string
	}): Promise<void> {
		const { tagName, selector, dataComponent } = data

		this.outputChannel.appendLine(`Element selected: ${tagName} - ${selector}`)
		if (dataComponent) {
			this.outputChannel.appendLine(`  data-component: ${dataComponent}`)
		}

		// Try to execute Claude chat command
		try {
			const message = dataComponent
				? `Explain this component: ${selector} (data-component: ${dataComponent})`
				: `Explain this component: ${selector}`

			// Attempt to call Claude chat command
			await vscode.commands.executeCommand("claude.chat", message)
		} catch (error) {
			// If Claude is unavailable, log to output console
			this.outputChannel.appendLine("Claude chat command not available, logging to console:")
			this.outputChannel.appendLine(`  Tag: ${tagName}`)
			this.outputChannel.appendLine(`  Selector: ${selector}`)
			if (dataComponent) {
				this.outputChannel.appendLine(`  Data Component: ${dataComponent}`)
			}
			this.outputChannel.show()
		}
	}

	/**
	 * Generate HTML content for the webview
	 */
	private getWebviewContent(): string {
		const nonce = this.getNonce()

		return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Content-Security-Policy" content="default-src 'none'; frame-src http: https:; style-src 'unsafe-inline'; script-src 'nonce-${nonce}';">
    <title>Browser Inspector</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            display: flex;
            flex-direction: column;
            height: 100vh;
            font-family: var(--vscode-font-family);
            background-color: var(--vscode-editor-background);
            color: var(--vscode-editor-foreground);
        }
        
        .toolbar {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 8px;
            background-color: var(--vscode-editor-background);
            border-bottom: 1px solid var(--vscode-panel-border);
        }
        
        .toolbar input {
            flex: 1;
            padding: 4px 8px;
            background-color: var(--vscode-input-background);
            color: var(--vscode-input-foreground);
            border: 1px solid var(--vscode-input-border);
            border-radius: 2px;
        }
        
        .toolbar button {
            padding: 4px 12px;
            background-color: var(--vscode-button-background);
            color: var(--vscode-button-foreground);
            border: none;
            border-radius: 2px;
            cursor: pointer;
        }
        
        .toolbar button:hover {
            background-color: var(--vscode-button-hoverBackground);
        }
        
        .toolbar button.active {
            background-color: var(--vscode-button-secondaryBackground);
            color: var(--vscode-button-secondaryForeground);
        }
        
        .iframe-container {
            flex: 1;
            position: relative;
            overflow: hidden;
        }
        
        iframe {
            width: 100%;
            height: 100%;
            border: none;
        }
        
        .status {
            padding: 4px 8px;
            background-color: var(--vscode-statusBar-background);
            color: var(--vscode-statusBar-foreground);
            font-size: 12px;
            border-top: 1px solid var(--vscode-panel-border);
        }
    </style>
</head>
<body>
    <div class="toolbar">
        <input type="text" id="urlInput" placeholder="Enter URL (e.g., http://localhost:3000)" value="${this.currentUrl}">
        <button id="loadButton">Load</button>
        <button id="inspectButton">Inspect Mode: OFF</button>
    </div>
    
    <div class="iframe-container">
        <iframe id="browserFrame" src="${this.currentUrl}"></iframe>
    </div>
    
    <div class="status">
        <span id="statusText">Ready</span>
    </div>

    <script nonce="${nonce}">
        (function() {
            const vscode = acquireVsCodeApi();
            const urlInput = document.getElementById('urlInput');
            const loadButton = document.getElementById('loadButton');
            const inspectButton = document.getElementById('inspectButton');
            const browserFrame = document.getElementById('browserFrame');
            const statusText = document.getElementById('statusText');
            
            let inspectMode = false;
            
            // Load button handler
            loadButton.addEventListener('click', () => {
                const url = urlInput.value.trim();
                if (url) {
                    browserFrame.src = url;
                    vscode.postMessage({ type: 'urlChange', url: url });
                    statusText.textContent = 'Loading: ' + url;
                }
            });
            
            // Enter key to load URL
            urlInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    loadButton.click();
                }
            });
            
            // Inspect mode toggle
            inspectButton.addEventListener('click', () => {
                inspectMode = !inspectMode;
                inspectButton.textContent = 'Inspect Mode: ' + (inspectMode ? 'ON' : 'OFF');
                inspectButton.classList.toggle('active', inspectMode);
                
                // Send inspect mode state to iframe
                try {
                    browserFrame.contentWindow.postMessage({
                        type: 'inspectMode',
                        enabled: inspectMode
                    }, '*');
                } catch (e) {
                    statusText.textContent = 'Cannot access iframe content (CORS restriction)';
                }
            });
            
            // Listen for messages from iframe
            window.addEventListener('message', (event) => {
                if (event.data.type === 'elementSelected') {
                    vscode.postMessage(event.data);
                    statusText.textContent = 'Selected: ' + event.data.data.selector;
                }
            });
            
            // Iframe load handler
            browserFrame.addEventListener('load', () => {
                statusText.textContent = 'Loaded: ' + browserFrame.src;
                
                // Try to inject inspector script into iframe
                try {
                    const iframeDoc = browserFrame.contentDocument || browserFrame.contentWindow.document;
                    
                    // Check if we can access the iframe content
                    if (iframeDoc) {
                        injectInspectorScript(iframeDoc);
                    }
                } catch (e) {
                    // CORS restriction - can't access iframe
                    statusText.textContent = 'Loaded (CORS-restricted): ' + browserFrame.src;
                }
            });
            
            // Inject inspector script into iframe
            function injectInspectorScript(iframeDoc) {
                const script = iframeDoc.createElement('script');
                script.textContent = ${JSON.stringify(this.getInspectorScript())};
                iframeDoc.body.appendChild(script);
            }
            
            // Notify extension that webview is ready
            vscode.postMessage({ type: 'ready' });
        })();
    </script>
</body>
</html>`
	}

	/**
	 * Get the inspector script to inject into the iframe
	 */
	private getInspectorScript(): string {
		return `
(function() {
    let inspectMode = false;
    let hoveredElement = null;
    const originalOutline = new Map();
    
    // Listen for inspect mode toggle from parent
    window.addEventListener('message', (event) => {
        if (event.data.type === 'inspectMode') {
            inspectMode = event.data.enabled;
            if (!inspectMode && hoveredElement) {
                removeHighlight(hoveredElement);
                hoveredElement = null;
            }
        }
    });
    
    // Generate CSS selector for an element
    function generateSelector(element) {
        if (!element || element === document) return '';
        
        // If element has ID, use it
        if (element.id) {
            return '#' + element.id;
        }
        
        // Build path with class names
        const path = [];
        let current = element;
        
        while (current && current !== document.body) {
            let selector = current.tagName.toLowerCase();
            
            // Add classes
            if (current.className && typeof current.className === 'string') {
                const classes = current.className.trim().split(/\\s+/).filter(c => c);
                if (classes.length > 0) {
                    selector += '.' + classes.join('.');
                }
            }
            
            // Add nth-child if needed for uniqueness
            if (current.parentElement) {
                const siblings = Array.from(current.parentElement.children);
                const sameTagSiblings = siblings.filter(s => s.tagName === current.tagName);
                if (sameTagSiblings.length > 1) {
                    const index = sameTagSiblings.indexOf(current) + 1;
                    selector += ':nth-of-type(' + index + ')';
                }
            }
            
            path.unshift(selector);
            current = current.parentElement;
        }
        
        return path.join(' > ');
    }
    
    // Add highlight to element
    function addHighlight(element) {
        if (!originalOutline.has(element)) {
            originalOutline.set(element, element.style.outline);
        }
        element.style.outline = '2px solid #007acc';
        element.style.outlineOffset = '2px';
    }
    
    // Remove highlight from element
    function removeHighlight(element) {
        if (originalOutline.has(element)) {
            element.style.outline = originalOutline.get(element);
            originalOutline.delete(element);
        }
    }
    
    // Mouse move handler for hover highlighting
    document.addEventListener('mousemove', (e) => {
        if (!inspectMode) return;
        
        const target = e.target;
        if (target === hoveredElement) return;
        
        // Remove previous highlight
        if (hoveredElement) {
            removeHighlight(hoveredElement);
        }
        
        // Add new highlight
        hoveredElement = target;
        addHighlight(hoveredElement);
    }, true);
    
    // Click handler for element selection
    document.addEventListener('click', (e) => {
        if (!inspectMode) return;
        
        e.preventDefault();
        e.stopPropagation();
        
        const target = e.target;
        const selector = generateSelector(target);
        const dataComponent = target.getAttribute('data-component');
        
        // Send element info to parent window
        window.parent.postMessage({
            type: 'elementSelected',
            data: {
                tagName: target.tagName,
                selector: selector,
                dataComponent: dataComponent
            }
        }, '*');
        
        // Flash the selected element
        const originalBg = target.style.backgroundColor;
        target.style.backgroundColor = '#007acc33';
        setTimeout(() => {
            target.style.backgroundColor = originalBg;
        }, 300);
    }, true);
})();
`
	}

	/**
	 * Generate a nonce for CSP
	 */
	private getNonce(): string {
		let text = ""
		const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
		for (let i = 0; i < 32; i++) {
			text += possible.charAt(Math.floor(Math.random() * possible.length))
		}
		return text
	}

	/**
	 * Dispose of the manager
	 */
	public dispose(): void {
		if (this.panel) {
			this.panel.dispose()
		}
	}
}
