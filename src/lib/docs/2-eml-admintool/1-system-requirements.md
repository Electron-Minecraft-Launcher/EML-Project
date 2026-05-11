---
title: System requirements
description: Hardware and software requirements for deploying EML AdminTool and developing a launcher with EML Lib.
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

# System requirements

> [!NOTE]
> EML AdminTool is **optional** since EML Lib 2.2. If you prefer to host your modpack files independently, you can generate a manifest using the [Modpack JSON generator](/resources/modpack-json-generator) and skip the AdminTool setup entirely. The AdminTool remains the recommended approach for teams and servers that need a dashboard, user management, profile support, or more advanced features.

## Production (Linux VPS)

A Linux-based VPS or dedicated server is required for production deployments.

|              | Minimum | Recommended |
| ------------ | ------- | ----------- |
| CPU          | 2 vCPU  | 4+ vCPU     |
| RAM          | 2 GB    | 4+ GB       |
| Free storage | 6 GB    | 10+ GB SSD  |

> [!NOTE]
> These figures are based on Ubuntu 24.04 LTS. Debian can run on slightly lower specifications.

> [!WARNING]
> Storage fills up quickly with modpack files and bootstrap archives. Monitor disk usage regularly — if it reaches 100%, uploads will fail.

**Operating system** — Ubuntu 22.04 LTS or later, or Debian 11 or later. Other Linux distributions are supported but not officially tested.

**Docker** — Required. Installation instructions are on the [next page](/docs/eml-admintool/production-setup/install-docker).

**NGINX** — Required to expose EML AdminTool securely over HTTPS. A configuration guide is provided at [Set up NGINX](/docs/eml-admintool/production-setup/set-up-nginx).

**A domain name** — Strongly recommended. Let's Encrypt certificates (used for HTTPS) do not support raw IP addresses. Without a domain, EML AdminTool will only be accessible over HTTP.

## Development (macOS / Windows)

For local testing, EML AdminTool runs on any system that supports Docker Desktop. No Linux administration knowledge is required. See [Dev setup](/docs/eml-admintool/development-setup/install-docker-desktop) for instructions.

