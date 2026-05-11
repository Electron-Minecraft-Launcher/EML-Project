---
title: Install Docker Desktop
description: How to install Docker Desktop on macOS or Windows for local development and testing of EML AdminTool.
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

# Install Docker Desktop

For local development and testing, EML AdminTool runs on macOS and Windows via Docker Desktop. This setup is not suitable for production — for a public deployment, follow the [Production setup](/docs/eml-admintool/production-setup/install-docker) guide instead.

<Tabs group="os">
<TabItem label="macOS">

**System requirements**

- A supported version of macOS (current release and the two previous major versions).
- At least 4 GB of RAM.

On Apple Silicon, installing Rosetta 2 is recommended for full compatibility:

```bash
softwareupdate --install-rosetta
```

**Installation**

1. Download Docker Desktop from the [official release page](https://www.docker.com/products/docker-desktop/).
2. Open the downloaded `.dmg` file and drag Docker to the Applications folder.
3. Launch Docker from Applications.
4. Accept the Docker Subscription Service Agreement when prompted.

> [!NOTE]
> Docker Desktop is free for personal use and open-source projects. Commercial use requires a paid subscription. See [Docker's pricing page](https://www.docker.com/pricing) for details.

</TabItem>
<TabItem label="Windows">

**System requirements**

Docker Desktop on Windows requires either WSL 2 or Hyper-V as a backend. WSL 2 is recommended.

- Windows 10 64-bit, version 22H2 or later, or Windows 11 64-bit, version 23H2 or later.
- At least 4 GB of RAM.
- Hardware virtualization enabled in BIOS/UEFI.

**Install or update WSL 2**

Open PowerShell as administrator and run:

```powershell
wsl --install
```

If WSL is already installed, update it:

```powershell
wsl --update
```

Restart your machine if prompted.

**Install Docker Desktop**

1. Download Docker Desktop from the [official release page](https://www.docker.com/products/docker-desktop/).
2. Run the installer (`Docker Desktop Installer.exe`).
3. On the configuration screen, ensure **Use WSL 2 instead of Hyper-V** is selected.
4. Follow the wizard to completion, then start Docker Desktop from the Start menu.
5. Accept the Docker Subscription Service Agreement when prompted.

If your Windows user account is different from the account used to install Docker Desktop, add your user to the `docker-users` group: open Computer Management as administrator, navigate to Local Users and Groups > Groups > docker-users, and add your account. Sign out and back in for the change to take effect.

</TabItem>
</Tabs>

**Verify the installation**

Open a terminal and run:

```bash
docker run hello-world
```

You should see a confirmation message. Docker Desktop is ready.

