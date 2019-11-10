// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('extension.swapSelections', function () {
		// The code you place here will be executed every time your command is executed
		const editor = vscode.window.activeTextEditor;
		const selections = editor.selections;
		if (selections.length < 2) {
			return vscode.window.showErrorMessage(`There's no selected texts to swap`);
		} else {
			const selectionsAndTexts = selections.map((sel, i) => {
				let idx = i + 1 > selections.length - 1 ? 0 : i + 1;
				return {selection: selections[idx], text: editor.document.getText(sel)};
			}).filter(sels => sels.text);
			if (!selectionsAndTexts.length) return vscode.window.showErrorMessage(
				`There's no selected texts to swap`
			);
			editor.edit(builder => {
				selectionsAndTexts.forEach(({selection, text}) => builder.replace(selection, text))
			});
			return vscode.window.showInformationMessage('Swapped ✅');
		}
	});

	context.subscriptions.push(disposable);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
