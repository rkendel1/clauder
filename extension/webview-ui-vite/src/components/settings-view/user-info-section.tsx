import React from "react"
import { Button } from "@/components/ui/button"
import { useExtensionState } from "../../context/extension-state-context"
import { vscode } from "@/utils/vscode"
import { getKoduSignInUrl } from "extension/shared/kodu"

const UserInfoSection: React.FC = () => {
	const extensionState = useExtensionState()
	const [isClicked, setIsClicked] = React.useState(false)

	if (extensionState.user === undefined) {
		return (
			<div className="flex flex-col gap-2 min-w-[90vw]">
				<Button
					className="w-fit"
					onClick={() => {
						setIsClicked(true)
						vscode.postTrackingEvent("AuthStart")
					}}
					asChild>
					<a href={getKoduSignInUrl(extensionState.uriScheme, extensionState.extensionName)}>
						Sign in to Kodu
					</a>
				</Button>
				{isClicked && (
					<Button
						className="w-fit"
						onClick={() => {
							vscode.postMessage({ type: "setApiKeyDialog" })
						}}
						variant={"link"}>
						Have Api Key click here
					</Button>
				)}
			</div>
		)
	}

	return (
		<>
			<div className="flex max-[280px]:items-start max-[280px]:flex-col max-[280px]:space-y-2 flex-row justify-between items-center">
				<div>
					<p className="text-xs font-medium">Signed in as</p>
					<p className="text-sm font-bold">{extensionState.user?.email}</p>
					<Button
						variant="link"
						size="sm"
						className="text-sm !text-muted-foreground"
						onClick={() => vscode.postMessage({ type: "didClickKoduSignOut" })}>
						sign out
					</Button>
				</div>
			</div>
		</>
	)
}

export default UserInfoSection
