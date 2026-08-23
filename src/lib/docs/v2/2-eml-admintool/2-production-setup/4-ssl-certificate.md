---
title: SSL certificate
description: How to obtain a free TLS certificate from Let's Encrypt and configure NGINX to serve EML AdminTool over HTTPS.
category: EML AdminTool — Production setup
author: Electron Minecraft Launcher
last-updated: 2026-05-13
---

<script>
  import Tabs from '$lib/components/Tabs.svelte';
  import TabItem from '$lib/components/TabItem.svelte';
  import CodeSwitch from '$lib/components/CodeSwitch.svelte';
  import CodeBlock from '$lib/components/CodeBlock.svelte';
</script>

# SSL certificate

HTTPS is mandatory for any production deployment of EML AdminTool. Running it over HTTP exposes admin credentials and player session tokens in plain text, and modern browsers may block API calls from insecure origins.

This guide uses **Let's Encrypt** and **Certbot** to obtain a free certificate and configure NGINX automatically.

> [!WARNING]
> Let's Encrypt does not issue certificates for raw IP addresses. You must have a valid domain name pointing to your server's public IP before proceeding. If you do not have one, EML AdminTool will remain on HTTP — acceptable for local testing, not for production.

## Install Certbot

<Tabs group="distro">
<TabItem label="Ubuntu / Debian">

```bash
sudo apt install -y certbot python3-certbot-nginx
```

</TabItem>
<TabItem label="RHEL / CentOS">

```bash
sudo dnf install -y epel-release
sudo dnf install -y certbot python3-certbot-nginx
```

</TabItem>
</Tabs>

## Obtain the certificate

Certbot reads your NGINX configuration, validates your domain with Let's Encrypt, and updates the virtual host file to add HTTPS automatically.

```bash
sudo certbot --nginx
```

Follow the prompts:

1. Enter your email address (used for renewal notices).
2. Agree to the Terms of Service.
3. Select your domain name from the list. **Do not select raw IP addresses** — validation will fail for them.
4. When asked about HTTP-to-HTTPS redirection, choose **Redirect** (recommended).

## Verify auto-renewal

Let's Encrypt certificates are valid for 90 days. Certbot installs a systemd timer that renews them automatically. Run a dry-run to confirm it works:

```bash
sudo certbot renew --dry-run
```

EML AdminTool is now accessible at `https://your-domain.com`.

