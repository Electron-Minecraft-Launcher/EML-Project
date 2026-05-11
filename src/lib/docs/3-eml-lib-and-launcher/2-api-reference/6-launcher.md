---
title: Launcher
description: API reference for the Launcher class — the core of EML Lib. Covers the Config object, all events, and common patterns including the options.txt workaround.
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

# Launcher

`Launcher` is the core class of EML Lib. It manages the full launch pipeline: computing what needs to be downloaded, fetching files, installing the mod loader, checking Java, and spawning the game process.

```js
import { Launcher, MicrosoftAuth } from 'eml-lib'

launchGame()

async function launchGame() {
  const launcher = new Launcher({
    url: 'https://at.myserver.com',
    root: 'myserver',
    account: account // obtained from MicrosoftAuth or another *Auth class
  })

  launcher.on('launch_download', (d) => {
    updateProgressBar(d.total.downloaded / d.total.amount)
  })

  await launcher.launch()
}
```

> [!TIP]
> Use the [configuration generator](/resources/config-generator) to build a valid `Config` object interactively.

## Constructor

| Parameter | Type     | Description                            | Required? |
| --------- | -------- | -------------------------------------- | --------- |
| `config`  | `Config` | The launcher configuration. See below. | Yes       |

## `launch()` method

Runs the full launch pipeline and spawns the Minecraft process.

> [!NOTE]
> This method automatically patches the [Log4j vulnerability](https://help.minecraft.net/hc/en-us/articles/4416199399693).

**Returns:** `Promise<void>`

**Throws:** `FETCH_ERROR` — If a request to fetch configuration or manifests fails. • `DOWNLOAD_ERROR` — If a file download fails. • `EXEC_ERROR` — If the game process cannot be spawned.

**Emits:** See Events below.

## Config

| Field                              | Type                                                        | Description                                                                                                                                                                                                                                     | Required?                                         |
| ---------------------------------- | ----------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------- |
| `root`                             | `string`                                                    | Name of the root game directory, without a leading dot (e.g. `'myserver'`). EML Lib prepends a dot automatically on all platforms.                                                                                                              | Yes                                               |
| `account`                          | `Account`                                                   | The authenticated player account. Use any `*Auth` class to obtain one.                                                                                                                                                                          | Yes                                               |
| `url`                              | `string`                                                    | URL of your EML AdminTool instance or your self-hosted manifest JSON. If omitted and no `minecraft.version` is set, Vanilla latest release is used. Ignored if `minecraft.version` or `profile.minecraft.version` is set.                       | No                                                |
| `profile`                          | `IProfile`                                                  | The profile to launch. Retrieve the list with [`Profiles.getProfiles()`](profiles). In agnostic mode (no `url`), the profile must have a valid `slug` for folder naming.                                                                        | No                                                |
| `profile.minecraft`                | `object`                                                    | Per-profile Minecraft configuration. Takes precedence over `minecraft` and AdminTool data.                                                                                                                                                      | No                                                |
| `profile.minecraft.version`        | `string`                                                    | Minecraft version for this profile (e.g. `'1.21.1'`, `'latest_release'`, `'latest_snapshot'`). Setting this makes `url` irrelevant for version resolution.                                                                                      | No                                                |
| `profile.minecraft.loader`         | `object`                                                    | Mod loader config for this profile. Ignored if `profile.minecraft.version` is not set.                                                                                                                                                          | No                                                |
| `profile.minecraft.loader.loader`  | `'vanilla' \| 'forge' \| 'neoforge' \| 'fabric' \| 'quilt'` | The mod loader to use for this profile.                                                                                                                                                                                                         | No (defaults to `'vanilla'`)                      |
| `profile.minecraft.loader.version` | `string`                                                    | The mod loader version. Required for any loader other than `'vanilla'`.                                                                                                                                                                         | No                                                |
| `profile.minecraft.modpackUrl`     | `string`                                                    | Direct URL to a modpack manifest JSON. Ignored if `profile.minecraft.version` is not set.                                                                                                                                                       | No                                                |
| `profile.minecraft.args`           | `string[]`                                                  | Custom Minecraft launch arguments for this profile.                                                                                                                                                                                             | No (defaults to `[]`)                             |
| `minecraft`                        | `object`                                                    | Global Minecraft configuration. Overridden by `profile.minecraft` if that field defines a version.                                                                                                                                              | No                                                |
| `minecraft.version`                | `string`                                                    | Global Minecraft version. Setting this makes `url` irrelevant for version resolution.                                                                                                                                                           | No                                                |
| `minecraft.loader`                 | `object`                                                    | Global mod loader configuration. Ignored if `minecraft.version` is not set.                                                                                                                                                                     | No                                                |
| `minecraft.loader.loader`          | `'vanilla' \| 'forge' \| 'neoforge' \| 'fabric' \| 'quilt'` | The global mod loader type.                                                                                                                                                                                                                     | No (defaults to `'vanilla'`)                      |
| `minecraft.loader.version`         | `string`                                                    | The global mod loader version. Required for any loader other than `'vanilla'`.                                                                                                                                                                  | No                                                |
| `minecraft.modpackUrl`             | `string`                                                    | Global modpack manifest URL. Ignored if `minecraft.version` is not set.                                                                                                                                                                         | No                                                |
| `minecraft.args`                   | `string[]`                                                  | Global custom launch arguments.                                                                                                                                                                                                                 | No (defaults to `[]`)                             |
| `storage`                          | `'isolated' \| 'shared'`                                    | How game files are organised on disk. `'isolated'` gives each profile its own folder. `'shared'` shares assets and libraries between profiles while keeping mods, config, and saves separate. If `'shared'`, set `cleaning.enabled` to `false`. | No (defaults to `'isolated'`)                     |
| `cleaning.enabled`                 | `boolean`                                                   | Whether to remove files from the instance folder that are not present in the modpack manifest. Must be `false` when `storage` is `'shared'`.                                                                                                    | No (defaults to `true`)                           |
| `cleaning.ignored`                 | `string[]`                                                  | Paths and files that the cleaner will never delete, even if they are absent from the manifest (e.g. `'saves/'`, `'options.txt'`).                                                                                                               | No (defaults to a standard Minecraft ignore list) |
| `java.install`                     | `'auto' \| 'manual'`                                        | `'auto'` downloads and manages the correct Java version automatically. `'manual'` uses a pre-installed Java executable.                                                                                                                         | No (defaults to `'auto'`)                         |
| `java.absolutePath`                | `string`                                                    | Absolute path to the Java executable. Required if `install` is `'manual'` and `relativePath` is not set. Overrides `relativePath`.                                                                                                              | No                                                |
| `java.relativePath`                | `string`                                                    | Path to Java relative to the game root. Ignored if `install` is `'auto'` or `absolutePath` is set.                                                                                                                                              | No                                                |
| `java.args`                        | `string[]`                                                  | Custom JVM arguments. Do not add Log4j patches here — they are applied automatically.                                                                                                                                                           | No (defaults to `[]`)                             |
| `memory.min`                       | `number`                                                    | Minimum RAM allocated to Minecraft, in MB.                                                                                                                                                                                                      | No (defaults to `512`)                            |
| `memory.max`                       | `number`                                                    | Maximum RAM allocated to Minecraft, in MB.                                                                                                                                                                                                      | No (defaults to `1024`)                           |
| `window.width`                     | `number`                                                    | Minecraft window width in pixels.                                                                                                                                                                                                               | No (defaults to `854`)                            |
| `window.height`                    | `number`                                                    | Minecraft window height in pixels.                                                                                                                                                                                                              | No (defaults to `480`)                            |
| `window.fullscreen`                | `boolean`                                                   | Launch Minecraft in fullscreen.                                                                                                                                                                                                                 | No (defaults to `false`)                          |

## Events

Events are emitted on the `Launcher` instance via `.on(event, callback)`.

**Step events** mark the start of a major phase in the launch pipeline.

| Event                     | Description                                           | Callback data                                               |
| ------------------------- | ----------------------------------------------------- | ----------------------------------------------------------- |
| `launch_compute_download` | Computing which files need to be downloaded.          | —                                                           |
| `launch_download`         | Downloading game files.                               | `{ total: { amount, size }, downloaded: { amount, size } }` |
| `launch_install_loader`   | Installing the mod loader.                            | `{ type, loaderVersion }`                                   |
| `launch_copy_assets`      | Copying asset files to the instance folder.           | —                                                           |
| `launch_extract_natives`  | Extracting native libraries.                          | —                                                           |
| `launch_patch_loader`     | Patching the mod loader.                              | —                                                           |
| `launch_check_java`       | Checking the Java installation.                       | —                                                           |
| `launch_clean`            | Cleaning unrecognised files from the instance folder. | —                                                           |
| `launch_launch`           | Spawning the Minecraft process.                       | `{ version, loader, loaderVersion }`                        |

**Progress events** are emitted continuously within a step.

| Event               | Description                                         | Callback data                                                            |
| ------------------- | --------------------------------------------------- | ------------------------------------------------------------------------ |
| `launch_data`       | A line of stdout/stderr from the Minecraft process. | `string`                                                                 |
| `launch_close`      | The Minecraft process has exited.                   | `number` (exit code)                                                     |
| `launch_debug`      | Internal debug log from EML Lib.                    | `string`                                                                 |
| `download_progress` | A file is being downloaded.                         | `{ type, total: { amount, size }, downloaded: { amount, size }, speed }` |
| `download_error`    | A file download failed.                             | `{ filename, type, message }`                                            |
| `download_end`      | All files of a given type have been downloaded.     | `{ amount, size }`                                                       |
| `extract_progress`  | A file is being extracted.                          | `{ filename }`                                                           |
| `extract_end`       | Extraction complete.                                | `{ amount }`                                                             |
| `copy_progress`     | A file is being copied.                             | `{ filename, destination }`                                              |
| `copy_end`          | Copy complete.                                      | `{ amount }`                                                             |
| `copy_debug`        | Debug log from the copy step.                       | `string`                                                                 |
| `java_info`         | Java version and architecture in use.               | `{ version, arch }`                                                      |
| `patch_progress`    | A file is being patched.                            | `{ filename }`                                                           |
| `patch_end`         | Patching complete.                                  | `{ amount }`                                                             |
| `patch_error`       | A file could not be patched.                        | `{ filename, message }`                                                  |
| `patch_debug`       | Debug log from the patch step.                      | `string`                                                                 |
| `clean_progress`    | A file is being removed by the cleaner.             | `{ filename }`                                                           |
| `clean_end`         | Cleaning complete.                                  | `{ amount }`                                                             |

## Preserving player-modified files

When `cleaning.enabled` is `true`, the cleaner removes any file in the instance folder that is absent from the modpack manifest. This includes files the player has created or modified locally — for example, a custom `options.txt`.

To protect a file from being deleted while still keeping the cleaner active, add it to `cleaning.ignored`:

```js
const launcher = new Launcher({
  // ...
  cleaning: {
    enabled: true,
    ignored: ['options.txt', 'saves/', 'screenshots/']
  }
})
```

> [!NOTE]
> `cleaning.ignored` only prevents deletion. If the same file is also present in the modpack manifest (uploaded via Files Updater), it will still be downloaded and overwrite the player's local version. To truly preserve a player-modified file, do not upload it to Files Updater **and** add it to `cleaning.ignored`.

## Use a default `options.txt` without overwriting player settings

If you want to provide a default `options.txt` with recommended keybinds and video settings, but don't want to overwrite players' custom settings on every launch, use the following workaround:

1. Open the js/ts file where you create the `Launcher` instance.

2. Import the `fs` module from Node.js:

   ```js
   import fs from 'node:fs'
   ```

3. In you `Config` object passed to the `Launcher` constructor: if `cleaning.enabled` is `true`, ensure that `options.txt` is included in the `cleaning.ignored` array to prevent it from being deleted by the cleaner.

   ```js
   const launcher = new Launcher({
     // ...
     cleaning: {
       enabled: true,
       ignored: [..., 'options.txt'] // add options.txt to the ignored list
     }
   })
   ```

4. Update your launch code to check if `options.txt` exists in the instance folder. If it doesn't, create it with your default content. Then proceed to launch as normal.

   ```js
   const optionsPath = path.join(launcher.config.root, 'options.txt')

   try {
     if (!fs.existsSync(optionsPath)) {
       if (!fs.existsSync(launcher.config.root)) {
         fs.mkdirSync(launcher.config.root, { recursive: true })
       }
       fs.writeFileSync(optionsPath, `DEFAULT OPTIONS CONTENT HERE`) // replace with your default options.txt content
     }

     launcher.launch() // proceed to launch as normal
   } catch (err) {
     logger.error('Launcher error:', err)
   }
   ```

> [!TIP]
> This approach could be used to provide default configuration for any file, not just `options.txt`. Just remember to add it to `cleaning.ignored` to prevent the cleaner from deleting it.
