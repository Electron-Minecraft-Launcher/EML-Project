---
title: Frontend architecture
description: Recommended architecture for a launcher UI built on Electron and EML Lib, covering the two-process model, IPC setup, and required views.
category: EML Lib and Launcher — Getting started
author: Electron Minecraft Launcher
last-updated: 2026-05-13
---

<script>
  import Tabs from '$lib/components/Tabs.svelte';
  import TabItem from '$lib/components/TabItem.svelte';
  import CodeSwitch from '$lib/components/CodeSwitch.svelte';
  import CodeBlock from '$lib/components/CodeBlock.svelte';
</script>

# Frontend architecture

This page defines the recommended architecture for a launcher UI built with Electron and EML Lib. The API reference pages that follow assume you have read this page.

## The two-process model

Electron splits every application into two distinct processes. Understanding this is the single most important prerequisite for Launcher development.

**The renderer process** is your HTML/CSS/JavaScript interface. It is sandboxed and cannot access the file system or spawn child processes directly.

**The main process** is a full Node.js environment. This is where EML Lib runs — all downloads, Java management, and game launching happen here.

The renderer cannot call EML Lib directly. It communicates with the main process through **IPC (Inter-Process Communication)**.

### The typical flow

1. The player clicks "Play" in the renderer.
2. The renderer sends an IPC message (`ipcRenderer.send('launch')`).
3. The main process receives it, calls `launcher.launch()`, and forwards progress events back to the renderer.
4. The renderer updates the progress bar.

## Setting up IPC

<Tabs group="lang">
<TabItem label="JavaScript">

**`electron/preload.js`** — Expose IPC methods to the renderer via `contextBridge`:

```js
import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('api', {
  launcher: {
    launch: () => ipcRenderer.invoke('launcher:launch'),
    onProgress: (cb) => ipcRenderer.on('launcher:progress', (\_e, data) => cb(data))
  },
  auth: {
    login: () => ipcRenderer.invoke('auth:login'),
    refresh: () => ipcRenderer.invoke('auth:refresh'),
    logout: () => ipcRenderer.invoke('auth:logout')
  }
})

// ...
```

**`src/ipc.js`** — Typed wrapper for use in the renderer:

```js
export const launcher = {
  launch: async () => await window.api.launcher.launch(),
  onProgress: (cb) => window.api.launcher.onProgress(cb)
}

export const auth = {
  login: async () => await window.api.auth.login(),
  refresh: async () => await window.api.auth.refresh(),
  logout: async () => await window.api.auth.logout()
}

// ...
```

</TabItem>
<TabItem label="TypeScript">

**`electron/preload.ts`** — Expose IPC methods to the renderer via `contextBridge`:

```ts
import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('api', {
  launcher: {
    launch: (): Promise<void> => ipcRenderer.invoke('launcher:launch'),
    onProgress: (cb: (data: unknown) => void) => ipcRenderer.on('launcher:progress', (_e, data) => cb(data))
  },
  auth: {
    login: (): Promise<unknown> => ipcRenderer.invoke('auth:login'),
    refresh: (): Promise<unknown> => ipcRenderer.invoke('auth:refresh'),
    logout: (): Promise<void> => ipcRenderer.invoke('auth:logout')
  }
})

// ...
```

**`src/ipc.ts`** — Typed wrapper for use in the renderer:

```ts
export const launcher = {
  launch: async (): Promise<void> => await window.api.launcher.launch(),
  onProgress: (cb: (data: unknown) => void) => window.api.launcher.onProgress(cb)
}

export const auth = {
  login: async () => await window.api.auth.login(),
  refresh: async () => await window.api.auth.refresh(),
  logout: async () => await window.api.auth.logout()
}

// ...
```

</TabItem>
</Tabs>

In `electron/main.js` (or `electron/main.ts`), organise your IPC handlers in a dedicated folder and register them on startup:

```js
import { registerAuthHandlers } from './handlers/auth'
import { registerLauncherHandlers } from './handlers/launcher'

app.whenReady().then(() => {
  registerAuthHandlers()
  registerLauncherHandlers()
  // ...
  createWindow()
})
```

## Recommended project structure

Replace `.js` with `.ts` if using TypeScript.

```
/
├── package.json
├── vite.config.js
│
├── electron/
│   ├── main.js           <- Main process entry point
│   ├── preload.js        <- Exposes IPC to the renderer
│   └── handlers/
│       ├── auth.js       <- IPC handlers for authentication
│       ├── launcher.js   <- IPC handlers for game launch
│       └── ...
│
├── src/
│   ├── index.html        <- Single HTML file with all views
│   ├── app.js            <- Core app logic and initialization
│   ├── ipc.js            <- Typed IPC wrapper for the renderer
│   ├── state.js          <- View switching and global state
│   ├── views/
│   │   ├── login.js
│   │   ├── home.js
│   │   ├── settings.js
│   │   └── ...
│   └── static/
│       ├── images/
│       └── styles/
│           ├── _variables.scss
│           ├── main.scss
│           └── ...
│
└── build/
    ├── icon.ico
    ├── icon.icns
    └── icon.png
```

`electron/` contains all Electron-specific code: main process entry, preload script, and IPC handlers. `handlers/` contains separate files for different IPC domains (authentication, launcher, etc.) to keep things organized. You should typically use EML Lib in those handlers, not directly in the renderer.

`src/` contains all frontend code. `index.html` is a single page with multiple view containers. `app.js` initializes the app and sets up global state. `ipc.js` is a typed wrapper around the IPC methods exposed by the preload script. `views/` contains JavaScript files for each view, responsible for rendering and user interactions. `static/` contains images and stylesheets.

`build/` contains static assets needed for the build, such as icons (see [Packaging](/docs/eml-lib-and-launcher/packaging) for details).

## Single Page Application model

Build the launcher as a Single Page Application. All views are `<div>` containers inside one `index.html` file; JavaScript shows and hides them to simulate navigation. This eliminates the white flash that occurs when loading a new HTML file.

```html
<div id="view-login" data-view="login">...</div>
<div id="view-home" data-view="home" hidden>...</div>
<div id="view-settings" data-view="settings" hidden>...</div>
<div id="view-maintenance" data-view="maintenance" hidden>...</div>
<div id="view-update" data-view="update" hidden>...</div>
```

## Required views

### Login view

Entry point for the application. Must contain a sign-in form with at least one authentication method. Microsoft authentication is strongly recommended.

- Show a loading indicator while authentication is in progress.
- Disable the login button during the request to prevent double submission.

### Home view

Main hub after login. Must contain a "Play" button and a progress bar (hidden by default, shown during download and launch).

Optional components: news feed, server status indicator, profile selector, player skin/username display.

- Disable the Play button while a download or launch is in progress.
- Update the progress bar in real time from EML Lib events forwarded via IPC.

### Settings view

Allows players to configure launcher behavior: RAM allocation, Java path, window resolution, post-launch action (minimize, close, or nothing), and logout.

- Validate RAM inputs: min ≤ max, both within reasonable bounds.

### Maintenance and update views

Blocking overlays. The maintenance view should display the reason message returned by the API and prevent access to the Play button. The update view should show download progress while a bootstrap update is being installed.

## DevTools

Access the full Chrome DevTools with `Ctrl+Shift+I` (Windows/Linux) or `Cmd+Option+I` (macOS).

> [!NOTE]
> EML Lib logs (download progress, errors) appear in the **terminal** where you ran `npm run dev`, not in the browser console, because they run in the main process. Forward them via IPC if you need them in the DevTools console.

