---
title: Files Updater
description: How to manage game files for each profile in EML AdminTool — uploading, organizing, and deleting modpack content.
category: EML AdminTool — Administration and features
author: Electron Minecraft Launcher
last-updated: 2026-05-03
---

<script>
  import Tabs from '$lib/components/Tabs.svelte';
  import TabItem from '$lib/components/TabItem.svelte';
  import CodeSwitch from '$lib/components/CodeSwitch.svelte';
  import CodeBlock from '$lib/components/CodeBlock.svelte';
</script>

# Files Updater

The **Files Updater** is where you manage the game content your players download. Anything you upload here is synced to players' machines the next time they launch or update their game. Deletions are also propagated — a file removed here will be removed from players' installations on their next sync.

![EML AdminTool Files Updater page](/images/docs/files-updater.png)

The root folder displayed in the Files Updater corresponds exactly to the game installation directory on the player's machine (e.g. `.myserver/`).

## Selecting a profile

If you have multiple profiles, select the target profile using the tabs at the top of the page. If only the default profile exists, the tabs are hidden.

## Files

The Files Updater works like a file manager. You can:

- **Upload** files and folders from your computer (drag and drop is supported).
- **Create** new folders directly in the interface.
- **Rename** and **delete** existing files and folders.
- **Edit** small text-based files (such as `.txt` or `.json` config files) directly in the browser.

> [!WARNING]
> Do not upload `minecraft.jar`, version JARs, version manifests, or the `assets/` and `libraries/` folders. These are managed automatically by the [Loader settings](loader-settings) feature.

### Recommended folder structure

Follow the standard Minecraft directory layout to ensure compatibility:

```
/ (profile root)
├── mods/            <- .jar mod files
├── config/          <- mod configuration files
├── resourcepacks/   <- .zip resource packs
├── shaderpacks/     <- (optional) shader packs
└── options.txt      <- (optional) default keybinds and video settings
```

### What not to upload

Avoid uploading files that are session-specific, player-specific, or regenerated on each run:

- `logs/`
- `saves/` (unless you intentionally want to distribute a pre-built map)
- `screenshots/`
- `usercache.json`, `usernamecache.json`
- The `versions/` folder (see [Mod loader configuration](#mod-loader-configuration) below)

### Handling `options.txt`

If you upload an `options.txt`, it will overwrite players' settings on every sync. Uploading it once to set default keybinds is reasonable. Uploading it on every modpack update will reset players' volume, sensitivity, and video settings repeatedly — avoid doing this unless intentional.

_Note: EML AdminTool does not currently support merging `options.txt` changes. This is a planned feature for a future release. Currently, you should hard-code the default `options.txt` in the launcher. See [workaround here](/docs/eml-lib-and-launcher/api-reference/launcher)._

## Mod loader configuration

The **Mod loader** section, located at the bottom of the page, controls the Minecraft version and modding engine for each profile. When players launch the game, EML Lib reads this configuration to download the correct game JARs, libraries, and loader installer.

To edit, hover over the section and click the edit button.

### Configuration options

**Loader** — The modding API to use for this profile:

| Value      | Description                                |
| ---------- | ------------------------------------------ |
| `Vanilla`  | Standard Minecraft, no mods.               |
| `Forge`    | The classic mod loader.                    |
| `NeoForge` | A modern fork of Forge.                    |
| `Fabric`   | A lightweight, modular mod loader.         |
| `Quilt`    | A fork of Fabric with additional features. |

**Minecraft version** — The game version (e.g. `1.21.1`). Must match the version your mods and server are built for.

**Loader version** — The specific version of the selected loader. For Vanilla, this field is not applicable. For all other loaders, use the latest stable version unless you have a specific reason not to.

> [!IMPORTANT]
> When you save a change to the loader configuration, EML AdminTool immediately updates the manifest. The next time a player starts the launcher, EML Lib will detect the change and download the new libraries and game JARs automatically. Players do not need to reinstall anything manually.

### Relationship with Files Updater

Loader settings and the Files Updater are complementary:

- **Files Updater** manages the content your players download: mods, configs, resource packs.
- **Loader settings** manages the engine that runs that content: the Minecraft version and mod loader.

Both must be configured for a profile to launch correctly.

