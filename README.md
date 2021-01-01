# split line no default key binding README

split one line into multiple lines by custom separator (default: ',')

**warning:**

this extension will append `'\n'` to separator in the outermost layer,
for example: `[1,], [2,], [3,]` will split into `[1,],\n [2,],\n [3,]`,
Unlike the original [split-line](https://github.com/chenxxzhe/vscode-ext-split-line), `[[1,], [2,], [3,]]` will be splited as well

## Features

![Screenshot](images/split-line-intro.gif "split line")

## How to use

1. open command pallette, input `split line`
2. you could configure keybindings `"extension.splitLine"` to change default separator in `args`
3. args has follow options: `separator: string`, `breakStartEnd: boolean`, `breakBeforeSeparator: boolean`

There is no default key binding, you can set hotkey in vscode `keybindings.json` like this:
```json
{
    "key": "ctrl+cmd+x",
    "command": "extension.splitLine",
    "when": "editorTextFocus && !editorReadonly",
    "args": {
      "separator": " ",
      "breakStartEnd": true,
      "breakBeforeSeparator": false
    }
}
```

