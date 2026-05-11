---
title: Uninstallation and reinstallation
description: Instructions for completely removing EML AdminTool from your server or your computer, and how to perform a clean reinstallation if needed.
category: EML AdminTool
author: Electron Minecraft Launcher
last-updated: 2026-05-03
---

<script>
  import Tabs from '$lib/components/Tabs.svelte';
  import TabItem from '$lib/components/TabItem.svelte';
  import CodeSwitch from '$lib/components/CodeSwitch.svelte';
  import CodeBlock from '$lib/components/CodeBlock.svelte';
</script>

# Uninstallation and reinstallation

You may want to uninstall EML AdminTool if you no longer need it or if you want to perform a clean reinstallation. This page provides instructions for both scenarios.

> [!NOTE]
> EML AdminTool administration page includes a factory reset option that deletes all data and settings. This is sufficient for most use cases. However, if you want to completely remove all traces of EML AdminTool from your server or your computer, follow the instructions below.

## Uninstalling EML AdminTool

1. If EML AdminTool is installed on a Linux VPS, connect to your server via SSH.

2. Navigate to the EML AdminTool configuration directory. By default, this is `~/.eml/admintool` under Linux and macOS, and `C:\Users\<YourUsername>\.eml\admintool` under Windows:

   ```bash
   cd ~/.eml/admintool
   ```

3. Remove the EML AdminTool containers and data with Docker Compose:

   ```bash
   docker compose -f docker-compose.prod.yml down --rmi all -v
   ```

4. Delete the EML AdminTool configuration directory:

   ```bash
   rm -rf ~/.eml/admintool
   ```

5. If you set up NGINX for EML AdminTool, remove the corresponding server block configuration and reload NGINX to apply the changes.

## Reinstalling EML AdminTool

To reinstall EML AdminTool, simply follow the installation instructions for your environment:

- For production deployments on a Linux VPS, see [Production setup](/docs/eml-admintool/production-setup/install-eml-admintool).
- For local development on Windows or macOS, see [Development setup](/docs/eml-admintool/development-setup/install-eml-admintool-dev).
