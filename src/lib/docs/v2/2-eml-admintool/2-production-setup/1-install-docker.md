---
title: Install Docker
description: How to install Docker Engine and Docker Compose on a Linux VPS for a production deployment of EML AdminTool.
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

# Install Docker

This page covers Docker Engine and Docker Compose installation on a Linux VPS. If you are setting up a local development environment on macOS or Windows, see [Development setup](/docs/eml-admintool/development-setup/install-docker-desktop) instead.

<small>The instructions below are adapted from the <a href="https://docs.docker.com/engine/install/">official Docker documentation</a> (Apache License 2.0).</small>

> [!WARNING]
> If your system uses `ufw` or `firewalld`, be aware that Docker manages its own `iptables` rules and will bypass your firewall for container ports. Do not expose port `8080` directly — use NGINX as a reverse proxy instead. See [Security hardening](/docs/eml-admintool/production-setup/security-hardening) for details.

## Uninstall conflicting packages

Before installing Docker, remove any unofficial packages that may conflict with it:

<Tabs group="distro">
<TabItem label="Ubuntu / Debian">

```bash
sudo apt remove docker.io docker-compose docker-compose-v2 docker-doc podman-docker containerd runc 2>/dev/null
```

</TabItem>
<TabItem label="RHEL / CentOS">

```bash
sudo dnf remove docker docker-client docker-client-latest docker-common \
 docker-latest docker-latest-logrotate docker-logrotate docker-engine podman runc
```

</TabItem>
</Tabs>

`apt` or `dnf` may report that none of these packages are installed — that is fine.

## Install Docker Engine

<Tabs group="distro">
<TabItem label="Ubuntu">

```bash
# Add Docker's official GPG key and repository

sudo apt update
sudo apt install -y ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg \
 -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

sudo tee /etc/apt/sources.list.d/docker.sources <<EOF
Types: deb
URIs: https://download.docker.com/linux/ubuntu
Suites: $(. /etc/os-release && echo "${UBUNTU_CODENAME:-$VERSION_CODENAME}")
Components: stable
Signed-By: /etc/apt/keyrings/docker.asc
EOF

sudo apt update

# Install Docker Engine and Compose plugin

sudo apt install -y docker-ce docker-ce-cli containerd.io \
 docker-buildx-plugin docker-compose-plugin
```

</TabItem>
<TabItem label="Debian">

```bash
# Add Docker's official GPG key and repository

sudo apt update
sudo apt install -y ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/debian/gpg \
 -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

sudo tee /etc/apt/sources.list.d/docker.sources <<EOF
Types: deb
URIs: https://download.docker.com/linux/debian
Suites: $(. /etc/os-release && echo "$VERSION_CODENAME")
Components: stable
Signed-By: /etc/apt/keyrings/docker.asc
EOF

sudo apt update

# Install Docker Engine and Compose plugin

sudo apt install -y docker-ce docker-ce-cli containerd.io \
 docker-buildx-plugin docker-compose-plugin
```

</TabItem>
<TabItem label="RHEL / CentOS">

```bash
sudo dnf install -y dnf-plugins-core
sudo dnf config-manager --add-repo \
 https://download.docker.com/linux/centos/docker-ce.repo

sudo dnf install -y docker-ce docker-ce-cli containerd.io \
 docker-buildx-plugin docker-compose-plugin

sudo systemctl enable --now docker
```

</TabItem>
</Tabs>

## Verify the installation

```bash
sudo docker run hello-world
```

This command pulls a test image and runs it. If Docker is correctly installed, you will see a confirmation message.

> [!NOTE]
> On Ubuntu and Debian, the Docker service starts automatically after installation. On RHEL and CentOS, the `systemctl enable --now docker` command in the previous step handles this. If Docker is not running, start it manually with `sudo systemctl start docker`.

## Allow running Docker without `sudo` (optional)

By default, Docker requires root privileges. To run Docker commands as your current user:

```bash
sudo usermod -aG docker $USER
newgrp docker
```

> [!WARNING]
> Adding a user to the `docker` group grants effective root-level access to the system. Only do this on a machine you control and trust.

