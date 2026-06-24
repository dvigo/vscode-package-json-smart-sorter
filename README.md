# Package.json Smart Sorter

<p align="center">
  <img src="icon2.png" width="128" height="128" alt="Package.json Smart Sorter Logo">
</p>

[![Visual Studio Marketplace](https://img.shields.io/vscode-marketplace/v/dvigo.vscode-package-json-smart-sorter.svg?label=Marketplace&color=blue)](https://marketplace.visualstudio.com/items?itemName=dvigo.vscode-package-json-smart-sorter)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**Package.json Smart Sorter** is a professional, lightweight VS Code extension designed to keep your `package.json` files perfectly organized. It automatically or manually sorts your dependencies, devDependencies, peerDependencies, and scripts with advanced grouping rules.

---

## Key Features

- **Scope-Aware Grouping**: Choose how to group scoped packages (starting with `@`, e.g., `@types/node`). Place them at the very top of your block, at the very bottom, or keep them naturally mixed inline.
- **Granular Control**: Independently toggle which sections to sort:
  - `dependencies`
  - `devDependencies`
  - `peerDependencies`
  - `scripts`
  - `overrides` (npm)
  - `pnpm.overrides` (pnpm)
- **Native VS Code Formatter Integration**: Registers as a native `DocumentFormattingEditProvider` for `package.json` files. Supports standard commands like **Format Document** and respects your indentation settings (`tabSize`, `insertSpaces`).
- **Context-Aware Right-Click Submenu**: Provides a dedicated **Smart Sorter** dropdown when right-clicking on any `package.json` file, allowing you to trigger targeted sort actions on-the-fly.
- **Robust Error Handling**: Automatically bypasses sorting during file saves if your JSON contains syntax errors, preventing file corruption. Manually executed actions display discrete warnings detailing syntax errors.

---

## How to Use

### 1. Formatting on Save (Automated)
To automatically sort your `package.json` when you save the file, add the following to your VS Code `settings.json`:

```json
"[json]": {
    "editor.defaultFormatter": "dvigo.vscode-package-json-smart-sorter",
    "editor.formatOnSave": true
}
```

### 2. Manual Sorting via Context Menu (Right-Click)
Right-click anywhere inside your open `package.json` file, hover over the **Smart Sorter** menu, and select your action:
- **Sort Configured Sections**: Sorts only the sections configured in your user settings.
- **Sort All Sections**: Sorts all supported sections (`dependencies`, `devDependencies`, `peerDependencies`, `scripts`, `overrides`, `pnpm.overrides`) regardless of current settings.
- **Sort Dependencies Only**
- **Sort DevDependencies Only**
- **Sort PeerDependencies Only**
- **Sort Scripts Only**
- **Sort Overrides Only**

### 3. Command Palette
Press `Cmd+Shift+P` (macOS) or `Ctrl+Shift+P` (Windows/Linux) and search for any of the **Smart Sorter** commands:
- `Smart Sorter: Sort Configured Sections`
- `Smart Sorter: Sort All Sections`
- `Smart Sorter: Sort Dependencies Only`
- `Smart Sorter: Sort DevDependencies Only`
- `Smart Sorter: Sort PeerDependencies Only`
- `Smart Sorter: Sort Scripts Only`
- `Smart Sorter: Sort Overrides Only`

---

## Configuration Settings

Customize the sorting behavior in VS Code settings (`Preferences > Settings` or search for `smartSorter`):

| Settings Key | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `smartSorter.sortDependencies` | `boolean` | `true` | Enables sorting for the `dependencies` block. |
| `smartSorter.sortDevDependencies` | `boolean` | `true` | Enables sorting for the `devDependencies` block. |
| `smartSorter.sortPeerDependencies` | `boolean` | `true` | Enables sorting for the `peerDependencies` block. |
| `smartSorter.sortScripts` | `boolean` | `false` | Enables sorting for the `scripts` block (alphabetical). |
| `smartSorter.sortOverrides` | `boolean` | `true` | Enables sorting for the npm `overrides` block. |
| `smartSorter.sortPnpmOverrides` | `boolean` | `true` | Enables sorting for the `pnpm.overrides` block. |
| `smartSorter.groupScopes` | `enum` | `"inline"` | Grouping options for scoped packages (`@/`):<br>- `"inline"`: Natural alphabetical order.<br>- `"top"`: Group and sort scoped packages at the beginning.<br>- `"bottom"`: Group and sort scoped packages at the very end. |

---

## License

This extension is licensed under the [MIT License](LICENSE).
