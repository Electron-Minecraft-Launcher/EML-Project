---
title: Security hardening
description: Recommended security measures for a production EML AdminTool deployment, including firewall configuration, DDoS protection, and application-level best practices.
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

# Security hardening

EML AdminTool controls what your players download and run. A compromised panel means a compromised launcher for every one of your players. The measures below cover the most common attack vectors for a Minecraft server stack.

None of these steps are strictly mandatory, but all are strongly recommended for any internet-facing deployment.

## Firewall configuration

The principle is simple: block everything, allow only what is needed.

<Tabs group="distro">
<TabItem label="Ubuntu / Debian (ufw)">

```bash
sudo apt install -y ufw

# Default policies

sudo ufw default deny incoming
sudo ufw default allow outgoing

# Allow SSH — do this before enabling the firewall or you will lock yourself out

sudo ufw allow 22/tcp

# Web traffic via NGINX

sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Minecraft game server (adjust port if needed)

sudo ufw allow 25565/tcp

sudo ufw enable
sudo ufw status
```

</TabItem>
<TabItem label="RHEL / CentOS (firewalld)">

```bash
sudo systemctl enable --now firewalld

sudo firewall-cmd --permanent --add-service=ssh
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --permanent --add-port=25565/tcp

sudo firewall-cmd --reload
```

</TabItem>
</Tabs>

> [!WARNING]
> Do not open port `8080` in your firewall. Traffic must reach EML AdminTool exclusively through NGINX on ports `80` and `443`. Opening `8080` directly bypasses SSL termination and all proxy-level security headers.

## DDoS protection

Game servers are frequent targets for volumetric attacks. Cloudflare is the most practical free option for hiding your server's real IP.

**For EML AdminTool (web traffic)** — Create an `A` record pointing to your server IP and enable Cloudflare's proxy (orange cloud). This absorbs HTTP-layer attacks and conceals your IP.

**For the Minecraft game server (TCP traffic)** — The standard Cloudflare proxy does not support the Minecraft protocol. Create a separate `A` record for your game subdomain (e.g., `play.myserver.com`) and leave the proxy disabled (grey cloud / DNS only). This exposes your real IP for the game port. To protect the game port as well, consider Cloudflare Spectrum (paid) or a DDoS-protected hosting provider such as OVH Game or NeoProtect.

## Application security

**Admin password** — Use a generated password of at least 16 characters for the administrator account. EML AdminTool is the single point of control for your launcher: if it is compromised, every player's machine is at risk.

**HTTPS** — Never run EML AdminTool in production over plain HTTP. If you have not done so yet, follow the [SSL certificate](ssl-certificate) guide.

**`.env` file** — The file at `~/.eml/admintool/.env` contains your database credentials and secret keys. Never share it, never commit it to a version control repository, and restrict its read permissions:

```bash
chmod 600 ~/.eml/admintool/.env
```

## System maintenance

A secure server is an up-to-date server. Unpatched software is the most common entry point for automated attacks.

<Tabs group="distro">
<TabItem label="Ubuntu / Debian">

```bash
sudo apt update && sudo apt upgrade -y
```

</TabItem>
<TabItem label="RHEL / CentOS">

```bash
sudo dnf update -y
```

</TabItem>
</Tabs>

Check the [GitHub releases](https://github.com/Electron-Minecraft-Launcher/EML-AdminTool/releases) page regularly for EML AdminTool updates and read the release notes before upgrading, as some versions require manual migration steps.

