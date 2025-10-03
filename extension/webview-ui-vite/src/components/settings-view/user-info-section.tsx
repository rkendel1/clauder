import React from "react"
import { Button } from "@/components/ui/button"
import { useExtensionState } from "../../context/extension-state-context"
import { vscode } from "@/utils/vscode"

const UserInfoSection: React.FC = () => {
	const extensionState = useExtensionState()

	if (extensionState.user === undefined) {
		return null
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
						onClick={() => vscode.postMessage({ type: "resetState" })}>
						sign out
					</Button>
				</div>
			</div>
		</>
	)
}

export default UserInfoSection
