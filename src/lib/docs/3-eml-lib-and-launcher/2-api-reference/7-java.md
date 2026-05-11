---
title: Java
description: API reference for the Java class, used to download and verify a Java runtime independently of the launch pipeline.
category: EML Lib and Launcher — API Reference
author: Electron Minecraft Launcher
last-updated: 2026-05-03
---

<script>
  import Tabs from '$lib/components/Tabs.svelte';
  import TabItem from '$lib/components/TabItem.svelte';
  import CodeSwitch from '$lib/components/CodeSwitch.svelte';
  import CodeBlock from '$lib/components/CodeBlock.svelte';
</script>

# Java

`Java` downloads and manages the Java Runtime Environment required to run Minecraft. In most cases, you do not need to use this class directly — when `java.install` is set to `'auto'` (the default), `Launcher` handles Java automatically as part of the launch pipeline.

Use `Java` directly if you want to pre-download Java before the player hits the Play button, or if you need to verify an existing Java installation.

```js
import { Java } from 'eml-lib'

downloadJava()

async function downloadJava() {
  const java = new Java({
    url: 'https://at.myserver.com',
    root: 'myserver',
    minecraft: { version: '1.21.1' }
  })

  java.on('download_progress', (p) => console.log(`Downloading Java: ${p.downloaded.amount}/${p.total.amount}`))

  await java.download()
}
```

## Constructor

| Parameter                  | Type     | Description                                                                                                                                        | Required? |
| -------------------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------- | --------- |
| `config.root`              | `string` | Name of the root game directory, without a leading dot.                                                                                            | Yes       |
| `config.url`               | `string` | URL of your EML AdminTool instance or manifest. Used to resolve the Minecraft version if `config.minecraft.version` is not set.                    | No        |
| `config.minecraft.version` | `string` | The Minecraft version to install Java for. Supports `'latest_release'` and `'latest_snapshot'`. If omitted, the version is fetched from the `url`. | No        |

## `getFiles()` method

Returns the list of Java files that need to be downloaded for the target Minecraft version, without downloading them.

| Parameter  | Type                | Description                                                                                  | Required? |
| ---------- | ------------------- | -------------------------------------------------------------------------------------------- | --------- |
| `manifest` | `MinecraftManifest` | A pre-fetched Minecraft version manifest. If omitted, the manifest is fetched automatically. | No        |

**Returns:** `Promise<File[]>`

**Throws:** `FETCH_ERROR` — If the manifest cannot be fetched.

## `download()` method

Downloads the Java runtime for the target Minecraft version.

**Returns:** `Promise<void>`

**Throws:** `DOWNLOAD_ERROR` — If a file download fails.

**Emits:** `download_progress` — A Java file is downloading. • `download_error` — A download failed. • `download_end` — All Java files have been downloaded.

## `check()` method

Verifies that a Java executable is correctly installed and matches the required major version.

| Parameter      | Type     | Description                                                                                     | Required?                                    |
| -------------- | -------- | ----------------------------------------------------------------------------------------------- | -------------------------------------------- |
| `absolutePath` | `string` | Absolute path to the Java executable. Use `${X}` as a placeholder for the major version number. | No (defaults to the path managed by EML Lib) |
| `majorVersion` | `number` | The required Java major version.                                                                | No (defaults to `8`)                         |

**Returns:** `Promise<{ version: string, arch: '64-bit' | '32-bit' }>`

**Throws:** `JAVA_ERROR` — If the executable is not found, cannot be run, or does not match the required major version.
