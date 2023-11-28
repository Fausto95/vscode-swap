import * as vscode from "vscode";

export async function replaceTextAtLine(editor: vscode.TextEditor) {
	const selectedText = editor.document.getText(editor.selection);
	if (!selectedText) {
		vscode.window.showInformationMessage("Select some text to replace.");
		return;
	}

	const userInput = await promptUserForPosition();
	if (!userInput) {
		return;
	}

	const { lineNumber, columnStart, columnEnd } = parsePositionInput(userInput);
	if (lineNumber === null) {
		vscode.window.showErrorMessage(
			"Invalid position format. Use Line:ColumnStart-ColumnEnd",
		);
		return;
	}

	if (!isValidLineNumber(lineNumber, editor)) {
		vscode.window.showErrorMessage("Invalid line number.");
		return;
	}

	const range = determineRange(lineNumber, columnStart, columnEnd, editor);
	replaceRangeWithText(editor, range, selectedText);
}

function parsePositionInput(input: string) {
	const positionMatch = input.match(/^(\d+)(?::(\d+))?(?:-(\d+))?$/);
	if (!positionMatch) {
		return { lineNumber: null, columnStart: null, columnEnd: null };
	}

	const lineNumber = parseInt(positionMatch[1], 10) - 1;
	const columnStart = positionMatch[2]
		? parseInt(positionMatch[2], 10) - 1
		: null;
	const columnEnd = positionMatch[3]
		? parseInt(positionMatch[3], 10) - 1
		: null;

	return { lineNumber, columnStart, columnEnd };
}

function isValidLineNumber(
	lineNumber: number,
	editor: vscode.TextEditor,
): boolean {
	return lineNumber >= 0 && lineNumber < editor.document.lineCount;
}

function determineRange(
	lineNumber: number,
	columnStart: number | null,
	columnEnd: number | null,
	editor: vscode.TextEditor,
): vscode.Range {
	if (columnStart !== null && columnEnd !== null) {
		return new vscode.Range(lineNumber, columnStart, lineNumber, columnEnd);
	}

	if (columnStart !== null) {
		const lineLength = editor.document.lineAt(lineNumber).text.length;
		return new vscode.Range(lineNumber, columnStart, lineNumber, lineLength);
	}

	// replace the whole line if no columns are provided
	return editor.document.lineAt(lineNumber).range;
}

function replaceRangeWithText(
	editor: vscode.TextEditor,
	range: vscode.Range,
	text: string,
) {
	editor.edit((editBuilder) => {
		editBuilder.replace(range, text);
	});
}

async function promptUserForPosition(): Promise<string | undefined> {
	return vscode.window.showInputBox({
		prompt: "Enter position as Line:ColumnStart-ColumnEnd",
		value: "",
		placeHolder: "e.g., 5:10-20",
	});
}
