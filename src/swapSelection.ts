import * as vscode from "vscode";

const MINIMUM_SELECTIONS = 2;

export async function swapSelections(editor: vscode.TextEditor) {
	if (!hasEnoughSelections(editor.selections)) {
		vscode.window.showErrorMessage("Select at least two areas to swap.");
		return;
	}

	const selectionsTexts = getSelectionsTexts(editor);
	if (selectionsTexts.length === 0) {
		vscode.window.showErrorMessage("No text found in selections to swap.");
		return;
	}

	try {
		await swapTextsInEditor(editor, selectionsTexts);
	} catch (error: any) {
		vscode.window.showErrorMessage(
			`Failed to swap selections: ${error.message}`,
		);
	}
}

function hasEnoughSelections(selections: readonly vscode.Selection[]): boolean {
	return selections.length >= MINIMUM_SELECTIONS;
}

function getSelectionsTexts(
	editor: vscode.TextEditor,
): { selection: vscode.Selection; text: string }[] {
	return editor.selections
		.map((selection, index) => {
			const nextIndex = (index + 1) % editor.selections.length;
			const text = editor.document.getText(selection);
			return { selection: editor.selections[nextIndex], text };
		})
		.filter((selectionText) => selectionText.text);
}

async function swapTextsInEditor(
	editor: vscode.TextEditor,
	selectionsTexts: { selection: vscode.Selection; text: string }[],
) {
	await editor.edit((builder) => {
		for (const { selection, text } of selectionsTexts) {
			builder.replace(selection, text);
		}
	});
}
