---
title: What is EML?
description: EML (Electron Minecraft Launcher) is an open-source ecosystem for building and distributing fully customized Minecraft launchers for your server.
category: Introduction
author: Electron Minecraft Launcher
last-updated: 2026-05-13
---

<script>
  import Tabs from '$lib/components/Tabs.svelte';
  import TabItem from '$lib/components/TabItem.svelte';
  import CodeSwitch from '$lib/components/CodeSwitch.svelte';
  import CodeBlock from '$lib/components/CodeBlock.svelte';
</script>

# What is EML?

EML (Electron Minecraft Launcher) is an open-source ecosystem that gives Minecraft server administrators the tools to build, distribute, and maintain a fully customized launcher for their players — without writing a launcher backend from scratch.

It is not a ready-made launcher you download and run. It is a **suite of components** you assemble and host yourself, giving you full control over what your players download, how they authenticate, and what version of the game they run.

## The three components

### EML AdminTool

EML AdminTool is the server-side component. It is a web dashboard packaged as a Docker container, meant to be deployed on a VPS or a local server. It acts as the control center for everything your launcher consumes:

- game files and modpack content, organized by profile;
- Minecraft version and mod loader configuration (Vanilla, Forge, NeoForge, Fabric, Quilt);
- launcher auto-update files (bootstraps);
- maintenance mode, news feed, and background images;
- user and permission management.

Players' launchers communicate with EML AdminTool over HTTP to fetch their configuration and files on startup.

> [!NOTE]
> EML AdminTool is optional since v2.2. You can use EML Lib in a standalone launcher without any server backend, but you will lose the ability to manage content and push updates remotely.

### EML Lib

EML Lib is a Node.js library that runs inside the launcher itself. It handles all the heavy lifting of the launch process:

- authenticating the player (Microsoft, Azuriom, Yggdrasil, or offline);
- querying EML AdminTool for the current modpack manifest;
- downloading Minecraft assets, libraries, and mod files;
- installing and patching the selected mod loader;
- managing the Java runtime and spawning the game process.

EML Lib is the bridge between your launcher's user interface and the underlying Minecraft engine.

### EML Template

EML Template is an optional starting point for the launcher frontend. It is an Electron + Vite boilerplate, pre-configured with TypeScript and SCSS, that already wires up IPC communication with EML Lib. You customize its appearance and add your server's branding on top.

> [!NOTE]
> You are not required to use EML Template. EML Lib can be integrated into any Electron project regardless of your build toolchain.

## How the components interact

At runtime, the flow is as follows:

1. A player opens your launcher (built on EML Template or your own Electron project).
2. The launcher calls EML Lib, which queries EML AdminTool for the current profile configuration.
3. EML Lib downloads any files that are missing or out of date on the player's machine.
4. EML Lib authenticates the player and launches Minecraft with the correct arguments.

EML AdminTool never communicates directly with Minecraft. It is a content and configuration server; EML Lib is the execution layer.

## Is EML right for your project?

EML is a good fit if you:

- run a Minecraft server and want to distribute a modpack automatically to your players;
- want players to connect through a branded launcher rather than the vanilla Minecraft client;
- need to manage multiple game profiles (e.g., a survival world and a modded server) from a single dashboard;
- want to push launcher updates, maintenance notices, and news without any manual action from players.

EML is **not** a good fit if you want a zero-configuration, hosted solution — EML requires a VPS and some system administration knowledge.

If you are comfortable managing a Linux VPS, working with Docker, and writing JavaScript or TypeScript, EML gives you a level of control and customization that few off-the-shelf solutions offer.

## What this documentation covers

This documentation is divided into three main parts:

- **EML AdminTool**: how to install, configure, and use the dashboard — for production deployments on Linux, and for local testing on macOS and Windows.
- **EML Lib**: how to build a launcher, from setting up the development environment to packaging and distributing the final executable.
- **Packaging**: how to produce platform-specific installers and connect them to EML AdminTool's auto-update system.

Start with [Required knowledge](/docs/introduction/required-knowledge) to verify that you meet the prerequisites, then follow the setup guides in order.

