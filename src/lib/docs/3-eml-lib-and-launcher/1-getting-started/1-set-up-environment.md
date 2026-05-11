---
title: Set up environment
description: How to install Node.js and initialize a launcher project with EML Lib, using EML Template or a manual setup.
category: EML Lib and Launcher — Getting started
author: Electron Minecraft Launcher
last-updated: 2026-05-03
---

<script>
  import Tabs from '$lib/components/Tabs.svelte';
  import TabItem from '$lib/components/TabItem.svelte';
  import CodeSwitch from '$lib/components/CodeSwitch.svelte';
  import CodeBlock from '$lib/components/CodeBlock.svelte';
</script>

# Set up environment

Before building the launcher, you need a working Node.js environment and an Electron project wired up with EML Lib.

## Install Node.js

EML Lib requires Node.js v20 or later. Node.js v24 LTS is recommended.

<Tabs group="os">
<TabItem label="Windows">

1. Go to the [Node.js website](https://nodejs.org/) and download the LTS installer.
2. Run the installer and follow the instructions.
3. Open a Command Prompt or PowerShell and verify:

```bash
node -v
# Should output v24.x.x or higher
```

</TabItem>
<TabItem label="macOS">

The easiest way is to use Homebrew. If you do not have it:

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

Then install Node.js:

```bash
brew install node@24
node -v
# Should output v24.x.x or higher
```

</TabItem>
<TabItem label="Linux">

Use `fnm` (Fast Node Manager):

```bash
curl -fsSL https://fnm.vercel.app/install | bash
source ~/.bashrc  # or source ~/.zshrc

fnm install 24
fnm use 24
node -v
# Should output v24.x.x or higher
```

</TabItem>
</Tabs>

## Initialize the project

There are two ways to get started: using EML Template (recommended for beginners) or setting up the environment manually.

### Option 1 — EML Template

EML Template is an Electron + Vite boilerplate pre-configured with TypeScript, SCSS, and electron-builder. IPC handlers, preload script, and EML Lib wiring are already in place. It is the fastest way to get a working launcher.

1. Go to the [EML Template repository](https://github.com/Electron-Minecraft-Launcher/EML-Template) on GitHub.

2. Click "Use this template" > "Create a new repository", or click "Fork", to create your own copy.

3. Clone and install:

   ```bash
   git clone https://github.com/YOUR_USERNAME/my-launcher.git
   cd my-launcher
   npm install
   ```

4. Open `electron/const.ts` and set the `ADMINTOOL_URL` constant to your EML AdminTool URL (or your self-hosted manifest URL if you are not using AdminTool).

5. Start the developer mode:

   ```bash
   npm run dev
   ```

You can now move on to [Frontend architecture](/docs/eml-lib-and-launcher/getting-started/frontend-architecture).

### Option 2 — Manual setup

<Tabs group="lang">
<TabItem label="JavaScript">

```bash
npm create vite@latest my-launcher -- --template vanilla
cd my-launcher
npm install
npm install eml-lib
npm install electron electron-builder vite-plugin-electron --save-dev
```

Create `vite.config.js`:

```js
import { defineConfig } from 'vite'
import electron from 'vite-plugin-electron'

export default defineConfig({
  plugins: [electron({ entry: 'electron/main.js' })]
})
```

Update `package.json`:

```json
{
  "name": "my-launcher",
  "version": "1.0.0",
  "main": "dist-electron/main.js",
  "scripts": {
    "dev": "vite",
    "build": "vite build && electron-builder"
  }
}
```

</TabItem>
<TabItem label="TypeScript">

```bash
npm create vite@latest my-launcher -- --template vanilla-ts
cd my-launcher
npm install
npm install eml-lib
npm install electron electron-builder vite-plugin-electron --save-dev
```

Create `vite.config.ts`:

```ts
import { defineConfig } from 'vite'
import electron from 'vite-plugin-electron'

export default defineConfig({
  plugins: [electron({ entry: 'electron/main.ts' })]
})
```

Update `package.json`:

```json
{
  "name": "my-launcher",
  "version": "1.0.0",
  "main": "dist-electron/main.js",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build && electron-builder"
  }
}
```

> [!NOTE]
> Even in TypeScript, the `main` field must point to the compiled output (`dist-electron/main.js`), not the source `.ts` file.

</TabItem>
</Tabs>

