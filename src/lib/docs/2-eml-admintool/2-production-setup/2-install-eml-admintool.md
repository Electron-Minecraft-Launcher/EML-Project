---
title: Install EML AdminTool
description: How to install and perform the initial setup of EML AdminTool on a Linux VPS.
category: EML AdminTool — Production setup
author: Electron Minecraft Launcher
last-updated: 2026-05-03
---

<script>
  import Tabs from '$lib/components/Tabs.svelte';
  import TabItem from '$lib/components/TabItem.svelte';
  import CodeSwitch from '$lib/components/CodeSwitch.svelte';
  import CodeBlock from '$lib/components/CodeBlock.svelte';
</script>

# Install EML AdminTool

## Installation

Run the installation script as a **non-root user**. The script will request `sudo` permissions when needed.

> [!CAUTION]
> Do not run this script as `root`. It will fail or produce incorrect file ownership.

<CodeSwitch>
<CodeBlock label="cURL">

```bash
curl -fsSL https://emlproject.com/install/admintool@latest | bash
```

</CodeBlock>
<CodeBlock label="Wget">

```bash
wget -qO- https://emlproject.com/install/admintool@latest | bash
```

</CodeBlock>
</CodeSwitch>

The script installs the latest stable version of EML AdminTool. To install a specific version, refer to the [packages page](/packages/admintool).

When prompted for a domain name, enter the domain you will use to access EML AdminTool (for example, `admintool.myserver.com`), without `http://` or `https://`. If you do not have a domain name yet, press Enter to skip — but note that you will need to update the configuration manually before going to production (see [Changing domain or IP](#changing-domain-or-ip) below).

> [!WARNING]
> EML AdminTool validates the origin of every incoming request. If the domain you enter here does not match the address you use to access the panel, login will fail.

Once the script completes, EML AdminTool is available at `http://<your-server-ip>:8080/`. Keep it on a private network or behind a firewall until you have completed the NGINX and SSL setup.

> [!WARNING]
> At this stage, EML AdminTool is not secured. Anyone who knows the URL can access the setup page and create the admin account. Complete the setup immediately, then follow the [NGINX](/docs/eml-admintool/production-setup/set-up-nginx) and [SSL](/docs/eml-admintool/production-setup/ssl-certificate) guides before exposing it to the internet.

## Initial setup

Open `http://<your-server-ip>:8080/` in a browser. You will be redirected to the setup wizard automatically.

### Step 1 — Language

Select the interface language. You can change it later in the general settings. If your language is not listed, you can contribute a translation via the [GitHub repository](https://github.com/Electron-Minecraft-Launcher/EML-AdminTool).

### Step 2 — Database password

Generate a strong database password using the "Generate" button. You do not need to remember it — it will be stored securely in the server configuration. Only set a custom password if you intend to access the database directly for backups or manual queries.

### Step 3 — Admin account

Create the administrator account. The username you choose here also becomes the global name of your EML AdminTool instance, and is typically the same as your Minecraft server name.

After clicking "Finish", EML AdminTool restarts to apply the configuration. This takes a few seconds. You will then be redirected to the login page.

> [!NOTE]
> If the redirect does not happen within a minute, refresh the page manually.

## Changing domain or IP

**If you move EML AdminTool to a new server**, switch from a local IP to a domain name, or change your domain, you must update the configuration manually.

1. Connect to your server via SSH.

2. Navigate to the installation directory (default: `~/.eml/admintool`).

3. Edit the `.env` file:

   ```bash
   nano ~/.eml/admintool/.env
   ```

4. Update the `ORIGIN` and `ALLOWED_ORIGINS` variables:

   ```env
   NODE_ENV=production
   ORIGIN=https://<your-domain>
   ALLOWED_ORIGINS=http://localhost:8080,http://127.0.0.1:8080,http://<local-ip>:8080,http://<public-ip>:8080,http://<your-domain>,https://<your-domain>
   ```

   Set `ORIGIN` to the primary address you use to access EML AdminTool:
   - `https://<your-domain>` if you have a domain and HTTPS (recommended)
   - `http://<your-domain>` if you have a domain but no HTTPS yet
   - `http://<public-ip>:8080` if you have no domain name

   Remove any entries from `ALLOWED_ORIGINS` that do not apply to your setup.

5. Restart EML AdminTool to apply the changes:

   ```bash
   docker compose -f ~/.eml/admintool/docker-compose.prod.yml down
   docker compose -f ~/.eml/admintool/docker-compose.prod.yml up -d
   ```

