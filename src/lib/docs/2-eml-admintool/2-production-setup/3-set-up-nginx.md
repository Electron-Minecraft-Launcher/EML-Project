---
title: Set up NGINX
description: How to configure NGINX as a reverse proxy for EML AdminTool, enabling access via a domain name on standard HTTP ports.
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

# Set up NGINX

By default, EML AdminTool listens on port `8080`. Setting up NGINX as a reverse proxy allows you to:

- access EML AdminTool via a domain name on standard ports (`80` / `443`);
- terminate HTTPS at the proxy level;
- avoid exposing Docker ports directly to the internet.

This guide assumes EML AdminTool is already installed and running. If you prefer Apache or Caddy, the NGINX configuration below can serve as a reference — consult their respective documentation for syntax differences.

## Install NGINX

<Tabs group="distro">
<TabItem label="Ubuntu / Debian">

```bash
sudo apt update
sudo apt install -y nginx
```

</TabItem>
<TabItem label="RHEL / CentOS">

```bash
sudo dnf install -y nginx
sudo systemctl enable --now nginx
```

</TabItem>
</Tabs>

## Configure the virtual host

<Tabs group="distro">
<TabItem label="Ubuntu / Debian">

Create a new configuration file:

```bash
sudo nano /etc/nginx/sites-available/eml-admintool
```

</TabItem>
<TabItem label="RHEL / CentOS">

Create a new configuration file:

```bash
sudo nano /etc/nginx/conf.d/eml-admintool.conf
```

</TabItem>
</Tabs>

Paste the following configuration, replacing `YOUR_DOMAIN_OR_IP` with all the addresses used to reach your server (domain name, public IP, local IP — separated by spaces):

```nginx
server {
  listen 80;

  server_name YOUR_DOMAIN_OR_IP;

  location / {
  proxy_pass http://localhost:8080;

    # Allow large file uploads (adjust as needed)
    client_max_body_size 1G;

    # Extended timeouts for large uploads
    proxy_read_timeout    300s;
    proxy_connect_timeout 300s;
    proxy_send_timeout    300s;

    proxy_set_header Host              $host;
    proxy_set_header X-Real-IP         $remote_addr;
    proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;

    # WebSocket support
    proxy_http_version 1.1;
    proxy_set_header Upgrade    $http_upgrade;
    proxy_set_header Connection "upgrade";

  }
}
```

> [!IMPORTANT]
> The `server_name` directive must match the entries you provided during the EML AdminTool installation script, and the values in `ALLOWED_ORIGINS` in your `.env` file. A mismatch will cause login to fail.

## Enable and reload

<Tabs group="distro">
<TabItem label="Ubuntu / Debian">

Enable the site by creating a symbolic link, then test and reload NGINX:

```bash
sudo ln -s /etc/nginx/sites-available/eml-admintool /etc/nginx/sites-enabled/eml-admintool
sudo nginx -t
sudo systemctl reload nginx
```

</TabItem>
<TabItem label="RHEL / CentOS">

Test and reload NGINX:

```bash
sudo nginx -t
sudo systemctl reload nginx
```

</TabItem>
</Tabs>

EML AdminTool is now accessible at `http://YOUR_DOMAIN_OR_IP` without the `:8080` port suffix. Proceed to [SSL certificate](/docs/eml-admintool//production-setup/ssl-certificate) to enable HTTPS.

