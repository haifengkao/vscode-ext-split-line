import * as vscode from 'vscode'
import splitIntoLines from './split'

export function activate(context: vscode.ExtensionContext) {

    const COMMAND = 'extension.splitLine'

    const OPT_BREAK_START_END = 'breakStartEnd'
    const OPT_BREAK_BEFORE = 'breakBeforeSeparator'

    const commandHandler = async function (args: any) {
        let sep: string | undefined
        let breakStartEnd: boolean = false
        let breakBeforeSeparator: boolean = false

        if (!args) {
            sep = await vscode.window.showInputBox({
                placeHolder: 'input separator for split.'
            })
            if (!sep) { sep = ',' }


            const optionSelected = await vscode.window.showQuickPick(
                [
                    { label: OPT_BREAK_START_END, description: 'break line in the start and end of selected string' },
                    { label: OPT_BREAK_BEFORE, description: 'break line before separator' },
                ],
                {
                    canPickMany: true,
                    placeHolder: 'choose break line option.'
                }
            ) || []
            breakStartEnd = optionSelected.some((opt) => opt.label === OPT_BREAK_START_END)
            breakBeforeSeparator = optionSelected.some((opt) => opt.label === OPT_BREAK_BEFORE)
        } else {
            sep = args.separator || ','
            breakStartEnd = !!args.breakStartEnd
            breakBeforeSeparator = !!args.breakBeforeSeparator
        }

        let editor = vscode.window.activeTextEditor
        if (!editor) { return }
        const document = editor.document
        let selection = editor.selection
        let word = document.getText(selection)
        let isSelectionMode = true

        const lineNumber = selection.active.line
        const line = document.lineAt(lineNumber)
        const range = line.range

        if (!word.trim().length) {
            // no selection, just operate on the whole line
            word = line.text
            isSelectionMode = false
        }

        const lines = splitIntoLines(word, sep, {
            breakStartEnd,
            breakBeforeSeparator,
        })

        if (isSelectionMode) {
            await editor.edit(builder => {
                builder.replace(selection, lines)
            })

            await vscode.commands.executeCommand(
                'editor.action.formatSelection',
                document.uri,
                selection,
            )

        } else {

            await editor.edit(builder => {
                builder.replace(range, lines)
            })

            // formatSelection doesn't work in non-selected mode, I don't know why
            await vscode.commands.executeCommand(
                'editor.action.formatDocument',
                document.uri
            )
        }
    }
    let disposable = vscode.commands.registerCommand(COMMAND, commandHandler)
    context.subscriptions.push(disposable)
}

// this method is called when your extension is deactivated
export function deactivate() { }
