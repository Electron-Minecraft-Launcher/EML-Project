---
title: Bootstrap
description: API reference for the Bootstrap class, used to check for and apply launcher auto-updates distributed via EML AdminTool.
category: EML Lib and Launcher — API Reference
author: Electron Minecraft Launcher
last-updated: 2026-05-13
---

<script>
  import Tabs from '$lib/components/Tabs.svelte';
  import TabItem from '$lib/components/TabItem.svelte';
  import CodeSwitch from '$lib/components/CodeSwitch.svelte';
  import CodeBlock from '$lib/components/CodeBlock.svelte';
</script>

# Bootstrap

`Bootstrap` checks whether a new version of the launcher executable is available on EML AdminTool and, if so, downloads and installs it. Call this at startup, before showing the main UI.

> [!WARNING]
> `Bootstrap` requires Electron and `electron-updater`. Install it with `npm install electron-updater`.

> [!WARNING]
> `Bootstrap` requires an EML AdminTool instance. It is not available in agnostic mode.

```js
import { Bootstrap } from 'eml-lib'

updateLauncher()

async function updateLauncher() {
  const bootstrap = new Bootstrap('https://at.myserver.com')
  
  try {
    const update = await bootstrap.checkForUpdate()

    if (update.updateAvailable) {
      bootstrap.on('download_progress', (p) => showUpdateProgress(p))
      bootstrap.on('download_end', () => update.runUpdate())
      await bootstrap.download()
    }
  } catch (err) {
    console.error(err)
  }
}
```

## Constructor

| Parameter | Type     | Description                             | Required? |
| --------- | -------- | --------------------------------------- | --------- |
| `url`     | `string` | The URL of your EML AdminTool instance. | Yes       |

## `checkForUpdate()` method

Compares the launcher's current version (from its `package.json`) with the version published on EML AdminTool.

**Returns:** `Promise<IBootstrap>` — Contains `updateAvailable: boolean`, the available version string, and a `runUpdate()` method to call after the download.

**Throws:** `FETCH_ERROR` — If the request to EML AdminTool fails.

## `download()` method

Downloads the update file for the current platform. Must be called after `checkForUpdate()` confirms that an update is available.

**Returns:** `Promise<string>` — The local path to the downloaded update file.

**Throws:** `DOWNLOAD_ERROR` — If the download fails.

**Emits:** `download_progress` — The update file is downloading. • `download_error` — The download failed. • `download_end` — The download is complete.

## `runUpdate()` method

Quits the application and launches the installer. Call this inside the `download_end` handler (or after `download()` resolves).

| Parameter | Type      | Description                                            | Required?                |
| --------- | --------- | ------------------------------------------------------ | ------------------------ |
| `silent`  | `boolean` | Windows only. Runs the installer without showing a UI. | No (defaults to `false`) |

**Returns:** `void`

**Emits:** `bootstrap_error` — If the installer cannot be launched.

