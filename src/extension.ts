import * as vscode from "vscode";
import { swapSelections } from "./swapSelection";
import { replaceTextAtLine } from "./replaceTextAtLine";

export function activate(context: vscode.ExtensionContext): void {
	const disposableSwap = vscode.commands.registerCommand(
		"extension.swapSelections",
		async () => {
			const editor = vscode.window.activeTextEditor;
			if (!editor) {
				vscode.window.showErrorMessage("No active editor found.");
				return;
			}
			await swapSelections(editor);
		},
	);

	const disposableReplacer = vscode.commands.registerCommand(
		"extension.replaceTextAtLine",
		async () => {
			const editor = vscode.window.activeTextEditor;
			if (!editor) {
				vscode.window.showErrorMessage("No active editor found.");
				return;
			}
			await replaceTextAtLine(editor);
		},
	);

	context.subscriptions.push(disposableSwap, disposableReplacer);
}

export function deactivate(): void {}

module.exports = {
	activate,
	deactivate,
};
