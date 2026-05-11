---
title: Install EML AdminTool (dev)
description: How to run EML AdminTool locally on macOS or Windows for development and testing purposes.
category: EML AdminTool — Development setup
author: Electron Minecraft Launcher
last-updated: 2026-05-03
---

<script>
  import Tabs from '$lib/components/Tabs.svelte';
  import TabItem from '$lib/components/TabItem.svelte';
  import CodeSwitch from '$lib/components/CodeSwitch.svelte';
  import CodeBlock from '$lib/components/CodeBlock.svelte';
</script>

# Install EML AdminTool (dev)

This page explains how to run EML AdminTool locally for development and testing. No NGINX, SSL certificate, or domain name is required.

> [!WARNING]
> This setup is intended for development only. Do not expose a local EML AdminTool instance to the internet without completing the [production setup](docs/eml-admintool/production-setup/install-docker) steps.

## Download the Compose file

Go to the [EML AdminTool releases page](https://github.com/Electron-Minecraft-Launcher/EML-AdminTool/releases) and download the `docker-compose.prod.yml` file from the assets of the version you want to install.

Store it in a dedicated, permanent directory — EML AdminTool needs this file to start. A good default location:

<Tabs group="os">
<TabItem label="macOS">

```
~/.eml/admintool/docker-compose.prod.yml
```

</TabItem>
<TabItem label="Windows">

```
C:\Users\<username>\.eml\admintool\docker-compose.prod.yml
```

</TabItem>
</Tabs>

Do not move or delete this file. EML AdminTool depends on it for subsequent starts and updates.

## Start EML AdminTool

Open a terminal, navigate to the directory containing the file, and run:

```bash
docker compose -f docker-compose.prod.yml up -d
```

EML AdminTool is now available at `http://localhost:8080/`.

## Initial setup wizard

Open `http://localhost:8080/` in a browser. You will be redirected to the setup wizard automatically. Follow the same steps as for a production installation:

1. **Language** — Select the interface language.
2. **Database password** — Use the "Generate" button to create a strong password.
3. **Admin account** — Create the administrator account with your server name as the username.

After clicking "Finish", EML AdminTool restarts and you are redirected to the login page.

## Stop and restart

To stop EML AdminTool:

```bash
docker compose -f docker-compose.prod.yml down
```

To start it again:

```bash
docker compose -f docker-compose.prod.yml up -d
```

> [!NOTE]
> Your data (users, files, settings) is persisted in a Docker volume and survives container restarts. It is only lost if you explicitly delete the volume with `docker volume prune` or equivalent.

