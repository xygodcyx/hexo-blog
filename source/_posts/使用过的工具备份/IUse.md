---
title: I USE
date: 2025-06-26
tags: ['工具']
author: QuHou
excerpt: 记录一下自己常用的工具，将来换电脑时可以快速配置和部署以便回复到之前的状态
---

# I USE

## 硬件

暂时没有很顺手的(主要是太穷了qwq，买不了好的设备)，目前使用的是联想小新air 14 alc 2021款，是我的第一个笔记本，鼠标是几十块的，键盘是自带的（买了一个狼蛛机械键盘，但是用不习惯……）
## 开发常用软件

1. 写代码：[Visual Studio Code](https://code.visualstudio.com/)，无需多言

2. 代码管理工具：[Git](https://git-scm.com/downloads)，注意配置代理
    ``` bash
    git config --global http.proxy http://127.0.0.1:7890

    git config --global https.proxy https://127.0.0.1:7890
    ```
3. 翻译软件：[网易有道翻译](https://fanyi.youdao.com/download-Windows?keyfrom=fanyiweb_navigation), 界面简洁、功能强大。唯一需要注意的是记得关闭自带的快捷键，划词翻译也可以考虑关闭了，这个功能对程序员来说就是累赘，经常莫名其妙的弹出导致误点击

4. 下载软件：[IDM](https://www.internetdownloadmanager.com/download.html)，注意配置UA（netdisk;P2SP;3.0.20.88），以及设置idm不要自动下载浏览器里的文件，这很烦人
5. 代理软件：[Clash](https://ikuuu.one/user/tutorial?os=windows&client=cfw)，这个提供商提供的软件几乎是开箱即用的，无需对国外和国内网站进行单独配置

    "terminal.integrated.fontFamily": "MesloLGM Nerd Font",
6. 终端美化：[oh-my-posh](https://ohmyposh.dev/)整天对着黑框框敲命令也太不爽了，对了，安装好oh-my-posh后不要忘记在vscode里设置一下终端字体（字体不要忘记安装了）
    ``` json
    ```
    顺便再下载一个[Windows Terminal](https://github.com/microsoft/terminal)，可以十分方便的进行分屏操作，终于不用在vscode里开终端占位置了（笔记本屏幕本来就小）

    `power shell 7.0`也值得下载，比普通的power shell支持更多自定义模块，直接用命令下载就行
    ``` bash
    winget install --id Microsoft.PowerShell --source winget
    ```
    下载完毕后vscode可能会识别不到，可以手动配置setting.json
    ::: details 配置power shell 7.0为默认终端
    ``` json
    "terminal.integrated.profiles.windows": {
        "PowerShell 7": {
        "path": "C:\\Program Files\\PowerShell\\7\\pwsh.exe"
        }
    },
    "terminal.integrated.defaultProfile.windows": "PowerShell 7",
    ```
    :::

## 日常使用软件
1. [QQ](https://im.qq.com/),无需多言
2. [微信](https://pc.weixin.qq.com/),无需多言
3. [Koodo Reader](https://koodoreader.com/zh)，看电子书软件，十分好用
4. [Z-lib](https://z-library.gs)，全世界最全的电子书库，到目前为止我想找的所有书都在这里找到了
## 一些配置文件

1. power shell 7.0（oh-my-bash的初始化、别名配置等）

::: details setting.json
``` bash
# 初始化 oh-my-posh（注意替换你的主题路径）
oh-my-posh init pwsh --config "$env:POSH_THEMES_PATH\kushal.omp.json" | Invoke-Expression

# === 联想功能 ===
Import-Module PSReadLine
Set-PSReadLineOption -PredictionSource HistoryAndPlugin
# Set-PSReadLineOption -PredictionViewStyle ListView

# === AI（可选）===
# Import-Module Az.Tools.Predictor
# Enable-AzPredictor -AllSession

# === 仅保存成功命令到历史 ===
# 清除旧事件避免重复绑定
Unregister-Event -SourceIdentifier PowerShell.OnCommandExecuted -ErrorAction SilentlyContinue

# 注册事件：只记录成功命令
Register-EngineEvent -SourceIdentifier PowerShell.OnCommandExecuted -SupportEvent -Action {
    $lastCommand = [Microsoft.PowerShell.PSConsoleReadLine]::GetBufferState().InputBuffer
    if ($?) {
        [Microsoft.PowerShell.PSConsoleReadLine]::AddToHistory($lastCommand)
    } else {
        [Microsoft.PowerShell.PSConsoleReadLine]::ClearHistory()
        Get-History | Where-Object { $_.CommandLine -ne $lastCommand } | ForEach-Object {
            Add-History -InputObject $_.CommandLine
        }
    }
}

#---------------------------------Git 别名---------------------------------


# === Git 美化 log 别名 ===
function gg {
  git log --graph --abbrev-commit --decorate --date=relative --all `
    --pretty=format:"%C(auto)%h%Creset - %s %Cgreen(%cr) %C(bold blue)<%an>%Creset%d"
}

# === 项目常用命令别名 ===
Set-Alias i  'pnpm install'
Set-Alias d  'npm run dev'
Set-Alias b  'npm run build'
Set-Alias t  'npm run test'
Set-Alias p  'npm run preview'
Set-Alias s  'npm run start'
Set-Alias u  'npm update'
Set-Alias x  'nx'

# === 目录跳转别名 ===
Function ..  { Set-Location .. }
Function ... { Set-Location ../.. }
Function cc  { Set-Location E:\ }
Function c   { code ./ }

# === 文件列表别名 ===
function Format-Size {
  param([long]$bytes)
  if ($bytes -ge 1GB) { return "{0:N2} GB" -f ($bytes / 1GB) }
  elseif ($bytes -ge 1MB) { return "{0:N2} MB" -f ($bytes / 1MB) }
  elseif ($bytes -ge 1KB) { return "{0:N2} KB" -f ($bytes / 1KB) }
  else { return "$bytes B" }
}

function ll {
  $ESC = [char]27
  $items = Get-ChildItem -Force

  # 表头
  $header = "{0,-10}  {1,-16}  {2,10}  {3,5}  {4,-25}" -f "Mode", "LastWriteTime", "Size", "Ext" , "Name"
  Write-Host "$ESC[1;36m$header$ESC[0m"  # 青色加粗表头

  foreach ($item in $items) {
    $isDir = $item.PSIsContainer
    $mode = $item.Mode
    $time = $item.LastWriteTime.ToString("yyyy-MM-dd HH:mm")
    $size = if ($isDir) { "-" } else { Format-Size $item.Length }
    $name = $item.Name
    $ext = if ($isDir) { "" } else { $item.Extension.ToLower() }

    # 着色名称
    $colorName = if ($isDir) {
      "$ESC[34m$name$ESC[0m"  # 蓝色
    } elseif ($ext -match '\.(ps1|exe|bat)') {
      "$ESC[32m$name$ESC[0m"  # 绿色
    } elseif ($item.Attributes -match 'Hidden') {
      "$ESC[90m$name$ESC[0m"  # 灰色
    } else {
      "$ESC[35m$name$ESC[0m"  # 粉色
    }

    # 输出每行
    "{0,-10}  {1,-16}  {2,10}  {3,5}  {4,-25}" -f $mode, $time, $size, $ext , $colorName
  }
}

# === 其他常用别名 ===
Function h    { Get-History }
Function path { $env:PATH -split ";" }

# === 快捷编辑配置文件 ===
Function eb { code $PROFILE }
Function rb { . $PROFILE }

# Git 快捷提交别名
function gac {
  param (
    [Parameter(Mandatory=$true)]
    [string]$Message
  )

  git add .
  git commit -m $Message
  git push
}
function gcf {
  param (
    [Parameter(Mandatory=$true)]
    [string]$Message
  )

  git commit --amend -m $Message
  git push --force
}

# === 查看所有别名 ===
Function as { Get-Alias | Out-Host }
```

:::

2. vscode设置（不一定是最新的）

::: details setting.json
``` json
{
  // 终端字体
  "security.workspace.trust.untrustedFiles": "open",
  "files.associations": {
    "*.cs": "csharp",
    "*.c": "cpp",
    "*.cpp": "cpp",
    "*.reanim": "xml"
  },
  "[csharp]": {
    "breadcrumbs.showFiles": true,
    "breadcrumbs.showEvents": true,
    "breadcrumbs.showClasses": true,
    "breadcrumbs.showBooleans": true,
    "breadcrumbs.showConstants": true,
    "breadcrumbs.showArrays": true,
    "breadcrumbs.showConstructors": true,
    "breadcrumbs.showEnumMembers": true,
    "editor.defaultFormatter": "ms-dotnettools.csharp"
  },
  "launch": {
    "configurations": [
      {
        "name": ".NET Core Attach",
        "type": "coreclr",
        "request": "attach"
      }
    ]
  },
  "explorer.confirmDelete": false,
  "debug.onTaskErrors": "debugAnyway",
  "git.enableSmartCommit": true,
  "liveServer.settings.donotShowInfoMsg": true,
  "files.autoSaveDelay": 500,
  "liveServer.settings.donotVerifyTags": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.minimap.enabled": true,
  "C_Cpp.autocomplete": "Default",
  "[cpp]": {
    "editor.quickSuggestions": {
      "comments": "on",
      "strings": "on",
      "other": "on"
    },
    "editor.defaultFormatter": "ms-vscode.cpptools"
  },
  "[c]": {
    "editor.quickSuggestions": {
      "comments": "on",
      "strings": "on",
      "other": "on"
    }
  },
  "editor.formatOnType": true,
  "editor.minimap.autohide": true,
  "editor.tabCompletion": "on",
  "editor.mouseWheelZoom": true,
  "editor.guides.bracketPairs": true,
  "explorer.confirmDragAndDrop": false,
  "c-cpp-compile-run.run-in-external-terminal": true,
  "background.fullscreen": {
    "images": [
      "file:///C:/Users/Administrator/Pictures/【哲风壁纸】8k-个性背景.png"
    ],
    "opacity": 0.1,
    "size": "cover",
    "position": "center",
    "interval": 0,
    "random": false
  },
  "chat.editing.alwaysSaveWithGeneratedChanges": true,
  "terminal.integrated.profiles.windows": {
    "PowerShell 7": {
      "path": "C:\\Program Files\\PowerShell\\7\\pwsh.exe"
    }
  },
  "terminal.integrated.fontFamily": "MesloLGM Nerd Font",
  "terminal.integrated.defaultProfile.windows": "PowerShell 7",
  "javascript.updateImportsOnFileMove.enabled": "always",
  "prettier.singleQuote": true,
  "prettier.singleAttributePerLine": true,
  "prettier.jsxSingleQuote": true,
  "prettier.bracketSameLine": true,
  "prettier.arrowParens": "avoid",
  "prettier.experimentalTernaries": true,
  "git.autofetch": true,
  "http.proxyAuthorization": null,
  "http.proxyStrictSSL": false,
  "liveServer.settings.proxy": {
    "proxyUri": "http://127.0.0.1:7890"
  },
  "editor.quickSuggestions": {
    "strings": "inline",
    "comments": "inline"
  },
  "platformio-ide.disablePIOHomeStartup": true,
  "editor.fontSize": 22,
  "editor.fontFamily": "InputMono, HACK, Courier New, monospace",
  "git.openRepositoryInParentFolders": "never",
  "redhat.telemetry.enabled": true,
  "xml.server.preferBinary": true,
  "[xml]": {
    "editor.defaultFormatter": "redhat.vscode-xml"
  },
  "xml.symbols.maxItemsComputed": 50000,
  "[typescript]": {
    "editor.defaultFormatter": "dbaeumer.vscode-eslint"
  },
  "search.followSymlinks": false,
  "git.autorefresh": false,
  "[jsonc]": {
    "editor.defaultFormatter": "vscode.json-language-features"
  },
  "editor.cursorSmoothCaretAnimation": "on",
  "[glsl]": {
    "editor.defaultFormatter": "raczzalan.webgl-glsl-editor"
  },
  "python.createEnvironment.trigger": "off",
  "cSpell.userWords": [
    "exceljs",
    "Konva"
  ],
  "editor.linkedEditing": true,
  "python.analysis.completeFunctionParens": true,
  "easysass.targetDir": "./css/",
  "compile-hero.disable-compile-files-on-did-save-code": false,
  "compile-hero.jade-output-toggle": false,
  "compile-hero.javascript-output-toggle": false,
  "compile-hero.pug-output-toggle": false,
  "compile-hero.typescript-output-toggle": false,
  "compile-hero.typescriptx-output-toggle": false,
  "prettier.enableDebugLogs": true,
  "codingcopilot.enableAutoCompletions": false,
  "codingcopilot.enableNextEditSuggestions": false,
  "codingcopilot.floatShortcut": false,
  "codingcopilot.enableInlineChat": false,
  "codingcopilot.enableInlineChatAutoFormatCode": false,
  "codingcopilot.enableCodelens": false,
  "codingcopilot.enableWorkspaceRules": false,
  "[rust]": {
    "editor.defaultFormatter": "rust-lang.rust-analyzer"
  },
  "rust-analyzer.restartServerOnConfigChange": true,
  "editor.fontLigatures": true,
  "workbench.colorTheme": "Shades of Purple (Super Dark)",
  "workbench.colorCustomizations": {
    "[Vira*]": {
      "toolbar.activeBackground": "#80CBC426",
      "button.background": "#80CBC4",
      "button.hoverBackground": "#80CBC4cc",
      "extensionButton.separator": "#80CBC433",
      "extensionButton.background": "#80CBC414",
      "extensionButton.foreground": "#80CBC4",
      "extensionButton.hoverBackground": "#80CBC433",
      "extensionButton.prominentForeground": "#80CBC4",
      "extensionButton.prominentBackground": "#80CBC414",
      "extensionButton.prominentHoverBackground": "#80CBC433",
      "activityBarBadge.background": "#80CBC4",
      "activityBar.activeBorder": "#80CBC4",
      "activityBarTop.activeBorder": "#80CBC4",
      "list.inactiveSelectionIconForeground": "#80CBC4",
      "list.activeSelectionForeground": "#80CBC4",
      "list.inactiveSelectionForeground": "#80CBC4",
      "list.highlightForeground": "#80CBC4",
      "sash.hoverBorder": "#80CBC480",
      "list.activeSelectionIconForeground": "#80CBC4",
      "scrollbarSlider.activeBackground": "#80CBC480",
      "editorSuggestWidget.highlightForeground": "#80CBC4",
      "textLink.foreground": "#80CBC4",
      "progressBar.background": "#80CBC4",
      "pickerGroup.foreground": "#80CBC4",
      "tab.activeBorder": "#80CBC4",
      "notificationLink.foreground": "#80CBC4",
      "editorWidget.resizeBorder": "#80CBC4",
      "editorWidget.border": "#80CBC4",
      "settings.modifiedItemIndicator": "#80CBC4",
      "panelTitle.activeBorder": "#80CBC4",
      "breadcrumb.activeSelectionForeground": "#80CBC4",
      "menu.selectionForeground": "#80CBC4",
      "menubar.selectionForeground": "#80CBC4",
      "editor.findMatchBorder": "#80CBC4",
      "selection.background": "#80CBC440",
      "statusBarItem.remoteBackground": "#80CBC414",
      "statusBarItem.remoteHoverBackground": "#80CBC4",
      "statusBarItem.remoteForeground": "#80CBC4",
      "notebook.inactiveFocusedCellBorder": "#80CBC480",
      "commandCenter.activeBorder": "#80CBC480",
      "chat.slashCommandForeground": "#80CBC4",
      "chat.avatarForeground": "#80CBC4",
      "activityBarBadge.foreground": "#000000",
      "button.foreground": "#000000",
      "statusBarItem.remoteHoverForeground": "#000000"
    }
  },
  "[haxe]": {
    "editor.defaultFormatter": "nadako.vshaxe"
  },
  "html-css-class-completion.enableScssFindUsage": true,
  "html-css-class-completion.enableFindUsage": true,
  "html-css-class-completion.enableEmmetSupport": true,
  "eslint.codeActionsOnSave.mode": "problems",
  "eslint.format.enable": true,
  "eslint.ignoreUntitled": true,
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[html]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "prettier.semi": false,
  "[json]": {
    "editor.defaultFormatter": "rvest.vs-code-prettier-eslint"
  },
  "workbench.secondarySideBar.showLabels": false,
  "[css]": {
    "editor.defaultFormatter": "dbaeumer.vscode-eslint"
  },
  "typescript.updateImportsOnFileMove.enabled": "always",
  "workbench.sideBar.location": "right",
  "editor.codeLensFontFamily": "InputMono, HACK, Courier New, monospace",
  "editor.inlineSuggest.showToolbar": "always",
  "workbench.panel.showLabels": false,
  "lldb.suppressUpdateNotifications": true,
}
```
:::