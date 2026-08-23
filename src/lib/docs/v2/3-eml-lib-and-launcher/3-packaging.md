---
title: Packaging
description: How to package your EML launcher into platform-specific installers using electron-builder, and how to connect the output to EML AdminTool's auto-update system.
category: EML Lib and Launcher — Packaging
author: Electron Minecraft Launcher
last-updated: 2026-05-13
---

<script>
  import Tabs from '$lib/components/Tabs.svelte';
  import TabItem from '$lib/components/TabItem.svelte';
  import CodeSwitch from '$lib/components/CodeSwitch.svelte';
  import CodeBlock from '$lib/components/CodeBlock.svelte';
</script>

# Packaging

Once your launcher is ready, the final step is to produce platform-specific installer files that your players can download. EML uses **electron-builder** for this task.

## Prerequisites

Prepare the following icon assets in a `build/` folder at the root of your project:

| File        | Format       | Minimum size |
| ----------- | ------------ | ------------ |
| `icon.ico`  | Windows icon | 256×256 px   |
| `icon.icns` | macOS icon   | 512×512 px   |
| `icon.png`  | Linux icon   | 512×512 px   |

> [!TIP]
> Online converters can produce `.ico` and `.icns` files from a PNG source image.

## Configuration

Create `electron-builder.yml` at the root of your project. Using a dedicated file keeps `package.json` clean.

```yaml
appId: com.myserver.launcher
productName: 'My Server Launcher'
copyright: 'Copyright © 2026 My Server'

directories:
  output: release
  buildResources: build

files:
  - "dist",
  - "dist-electron",
  - "package.json",
  - "!**/node_modules/*/{CHANGELOG.md,README.md,README,readme.md,readme}",
  - "!**/node_modules/*/{test,__tests__,tests,powered-test,example,examples}",
  - "!**/node_modules/*.d.ts",
  - "!**/node_modules/.bin",
  - "!**/*.{iml,o,hprof,orig,pyc,pyo,rbc,swp,csproj,sln,xproj}",
  - "!.editorconfig",
  - "!**/._*",
  - "!**/{.DS_Store,.git,.hg,.svn,CVS,RCS,SCCS,.gitignore,.gitattributes}",
  - "!**/{__pycache__,thumbs.db,.flowconfig,.idea,.vs,.nyc_output}",
  - "!**/{appveyor.yml,.travis.yml,circle.yml}",
  - "!**/{npm-debug.log,yarn.lock,.yarn-integrity,.yarn-metadata.json}"

publish:
  provider: generic
  url: 'https://myserver.com/'

win:
  target: nsis
  icon: build/icon.ico

nsis:
  oneClick: false
  perMachine: false
  allowToChangeInstallationDirectory: true
  shortcutName: 'My Server'
  createDesktopShortcut: true
  createStartMenuShortcut: true
  deleteAppDataOnUninstall: true
  artifactName: '${productName} Setup ${version}.${ext}'

mac:
  target:
    - dmg
    - zip
  icon: build/icon.icns
  category: public.app-category.games
  hardenedRuntime: true
  gatekeeperAssess: false
  artifactName: '${productName} ${version}.${ext}'

dmg:
  title: 'Install My Server'
  contents:
    - x: 130
      y: 220
    - x: 410
      y: 220
      type: link
      path: /Applications

linux:
  target:
    - AppImage
  icon: build/icon.png
  category: Game
  artifactName: '${productName}-${version}-linux.${ext}'
```

## Building

Add the build script to `package.json`:

<CodeSwitch>
<CodeBlock label="JavaScript">

```json
  "scripts": {
    "build": "vite build && electron-builder",
    "build:win": "vite build && electron-builder --win",
    "build:mac": "vite build && electron-builder --mac",
    "build:mac-universal": "vite build && electron-builder --mac --universal",
    "build:lin": "vite build && electron-builder --linux"
  }
```

</CodeBlock>
<CodeBlock label="TypeScript">

```json
  "scripts": {
    "build": "tsc && vite build && electron-builder",
    "build:win": "tsc && vite build && electron-builder --win",
    "build:mac": "tsc && vite build && electron-builder --mac",
    "build:mac-universal": "tsc && vite build && electron-builder --mac --universal",
    "build:lin": "tsc && vite build && electron-builder --linux"
  }
```

</CodeBlock>
</CodeSwitch>

You can then build from your terminal _or_ from GitHub Actions:

### Build locally

To build for all platforms, run:

```bash
npm run build
```

To build for a specific platform, run:

```bash
npm run build:win   # Windows
npm run build:mac   # macOS
npm run build:lin   # Linux
```

Output files are written to the `release/` folder.

> [!NOTE]
> Electron launchers must be built on the target platform. Build the Windows installer on Windows, the macOS installer on macOS. Linux AppImages can be built from any platform.

### Build with GitHub Actions

GitHub Actions provides hosted runners for Windows, macOS, and Linux, making it easy to build for all platforms from a single workflow. Here's an **example** workflow that builds and uploads the artifacts as workflow outputs.

1. Create `.github/workflows/build.yml`:

   ```yaml
   name: Build
   on:
     push:
       branches: [main]
     pull_request:
       branches: [main]
   
   jobs:
     build:
       runs-on: ${{ matrix.os }}
       strategy:
         matrix:
           include:
             - os: windows-latest
               script: build:win
               ext: exe
             - os: macos-latest
               script: build:mac
               ext: dmg
             - os: macos-latest
               script: build:mac-universal
               ext: dmg
             - os: ubuntu-latest
               script: build:lin
               ext: AppImage
       steps:
         - uses: actions/checkout@v4
         
         - name: Set up Node.js
           uses: actions/setup-node@v4
           with:
             node-version: 24
             cache: 'npm'
             
         - name: Install dependencies
           run: npm ci
           
         - name: Build
           run: npm run ${{ matrix.script }}
           env:
             CSC_IDENTITY_AUTO_DISCOVERY: false 
             
         - name: Upload artifact
           uses: actions/upload-artifact@v4
           with:
             name: launcher-${{ matrix.os }}
             path: release/*.${{ matrix.ext }}
   ```

2. Commit and push to GitHub. The workflow will run automatically, and you can download the artifacts from the workflow run page.

## Code signing

Without a code signing certificate, Windows will display a SmartScreen warning and macOS will refuse to open the app.

<Tabs group="os">
<TabItem label="Windows">

If you have a `.pfx` certificate, add to `electron-builder.yml`:

```yaml
win:
  certificateFile: certs/my-certificate.pfx
  certificatePassword: '${env.CSC_KEY_PASSWORD}'
```

Without a certificate, players must click **More info** > **Run anyway** in the SmartScreen dialog.

</TabItem>
<TabItem label="macOS">

macOS signing and notarization require an Apple Developer Account ($99/year). Export your "Developer ID Application" certificate to your Keychain, then add a `notarize` hook to your build process. See the [electron-builder notarization guide](https://www.electron.build/code-signing) for details.

> [!IMPORTANT]
> Without notarization, the app will be blocked by Gatekeeper on other people's Macs. It will not run at all, even with the user's explicit consent.

</TabItem>
</Tabs>

## Uploading to EML AdminTool

After a successful build, upload the output to EML AdminTool to enable auto-updates for your players. For each platform you support, three files are required.

<Tabs group="os">
<TabItem label="Windows">

| File      | Example                                       |
| --------- | --------------------------------------------- |
| Installer | `My Server Launcher Setup 1.1.0.exe`          |
| Manifest  | `latest.yml`                                  |
| Blockmap  | `My Server Launcher Setup 1.1.0.exe.blockmap` |

</TabItem>
<TabItem label="macOS">

| File     | Example                                     |
| -------- | ------------------------------------------- |
| Archive  | `My Server Launcher-1.1.0-mac.zip`          |
| Manifest | `latest-mac.yml`                            |
| Blockmap | `My Server Launcher-1.1.0-mac.zip.blockmap` |

</TabItem>
<TabItem label="Linux">

| File     | Example                                            |
| -------- | -------------------------------------------------- |
| AppImage | `My Server Launcher-1.1.0-linux.AppImage`          |
| Manifest | `latest-linux.yml`                                 |
| Blockmap | `My Server Launcher-1.1.0-linux.AppImage.blockmap` |

</TabItem>
</Tabs>

Go to **EML AdminTool > Bootstraps**, click the edit button, upload the files for each platform, and save. Players will receive the update the next time they start the launcher.

See [Bootstraps](/docs/eml-admintool/administration-and-features/bootstraps) in the EML AdminTool documentation and [`Bootstrap`](/docs/eml-lib-and-launcher/api-reference/bootstrap) in the EML Lib reference for the full flow.

## Troubleshooting

**"Cannot create symbolic link" on Windows** — Enable Developer Mode: Settings > System > Advanced > Developer Mode.

**Antivirus false positives** — Unsigned executables are frequently flagged by heuristic scanners. Submit your `.exe` to Microsoft for analysis, or invest in a code signing certificate (EV or OV) to eliminate the warning permanently.
