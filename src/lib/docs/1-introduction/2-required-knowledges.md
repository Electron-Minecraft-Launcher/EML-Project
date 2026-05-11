---
title: Required knowledge
description: EML is not a plug-and-play solution. Before starting, make sure you are comfortable with the technical concepts listed on this page.
category: Introduction
author: Electron Minecraft Launcher
last-updated: 2026-05-03
---

<script>
  import Tabs from '$lib/components/Tabs.svelte';
  import TabItem from '$lib/components/TabItem.svelte';
  import CodeSwitch from '$lib/components/CodeSwitch.svelte';
  import CodeBlock from '$lib/components/CodeBlock.svelte';
</script>

# Required knowledge

EML is a suite of tools for developers and server administrators. It requires assembling several moving parts — a Docker-based backend, a reverse proxy, and an Electron application — so a baseline of technical knowledge is necessary before you start.

The prerequisites are split between the two main components: EML AdminTool (the server side) and EML Lib (the launcher side). You may only need one of the two depending on your role.

## EML AdminTool

The following concepts are required to deploy and operate EML AdminTool, whether in production on a Linux VPS or locally for development.

**Docker and Docker Compose** — EML AdminTool runs entirely inside Docker containers. You must understand what Docker is, how to pull and run images, and how to work with `docker-compose.yml` files.

**Linux system administration** — Production deployments target Linux VPS environments (Ubuntu or Debian). You must be able to navigate the command line, manage file permissions, edit configuration files, and run system services.

**Web server / reverse proxy** — A reverse proxy (NGINX is recommended) is required to expose EML AdminTool securely to the internet. You should know how to install and configure a basic NGINX virtual host.

**DNS and networking** — You must be able to configure DNS records (A or CNAME) to point a domain name to your server's IP address, and understand the difference between HTTP and HTTPS.

**SSL certificates** — Securing EML AdminTool with HTTPS is mandatory for any production deployment. You should know what TLS is and be comfortable using Let's Encrypt via Certbot to obtain and renew certificates.

> [!NOTE]
> For local development and testing, EML AdminTool also runs on macOS and Windows via Docker Desktop. Linux system administration knowledge is not required in that context.

## EML Lib (launcher development)

The following concepts are required to build and distribute a launcher using EML Lib and EML Template.

**JavaScript or TypeScript** — EML Lib is a Node.js library written in TypeScript. A solid understanding of modern JavaScript (ES modules, async/await, events) is required. TypeScript knowledge is strongly recommended.

**Node.js and npm** — You must be able to manage a Node.js project: install dependencies with npm, understand `package.json`, and run scripts.

**Electron** — The launcher is an Electron application. You should understand Electron's two-process model (`main` process and `renderer` process) and how IPC (Inter-Process Communication) works between them.

**Basic build tooling** — EML Template uses Vite as a build tool and electron-builder for packaging. Familiarity with these tools is helpful, though not strictly required if you use the template as-is.

> [!NOTE]
> You do not need to understand every concept listed here before reading further. This page is meant as a reference checklist, not a prerequisite exam. If you are unsure about a specific concept, follow the relevant links as you encounter them in the guides.
