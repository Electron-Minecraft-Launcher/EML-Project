---
title: Stats
description: API reference for the Stats class, used to send anonymous usage data from your Minecraft launcher to EML AdminTool.
category: EML Lib and Launcher — API Reference
author: Electron Minecraft Launcher
last-updated: 2026-05-13
---

<script>
  import Tabs from '$lib/components/Tabs.svelte';
  import TabItem from '$lib/components/TabItem.svelte';
  import CodeSwitch from '$lib/components/CodeSwitch.svelte';
  import CodeBlock from '$lib/components/CodeBlock.svelte';
</script>

# Stats

`Stats` sends stats about the launcher to EML AdminTool.

> [!WARNING]
> `Stats` requires an EML AdminTool instance. It is not available in agnostic mode.

> [!NOTE]
> This class is compliant with the [GDPR](https://en.wikipedia.org/wiki/General_Data_Protection_Regulation), and does not send any personally identifiable information to EML. However, it does send some anonymous usage statistics to help you improve the launcher.

```ts
import { Stats } from 'eml-lib'

sendStats()

async function sendStats() {
  const stats = new Stats('https://at.myserver.com', '1.0.0')

  try {
    await stats.initialize()
    stats.attach(bootstrap) // `bootstrap` is an instance of the `Bootstrap` class
    stats.attach(auth) // `auth` is an instance of an `*Auth` class
    stats.attach(launcher) // `launcher` is an instance of the `Launcher` class
  } catch (err) {
    console.log('Failed to send stats:', err)
  }
}
```

Before sending any stats, the class performs a _handshake_ with the EML AdminTool instance. To prevent abuse, the server may reject the request if it is sent too frequently. The EML AdminTool allows a maximum of **1 handshake per 10 minutes** and **10 stats events per 10 minutes**. If the limit is exceeded, the server will respond with a `429 Too Many Requests` error.

## Constructor

| Parameter | Type                                                              | Description                                                                                                                                                                                                                            | Required?                   |
| --------- | ----------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------- |
| `url`     | `string`                                                          | The URL of your EML AdminTool website.                                                                                                                                                                                                 | Yes                         |
| `version` | `string`                                                          | The version of the launcher (from the package.json). This is used to track which versions of the launcher are being used, and to help you improve the launcher.                                                                        | No (defaults to `25565`)    |
| `events`  | `('STARTUP'  &#124 'LOGIN"  &#124 'LAUNCH'  &#124 'BOOTSTRAP')[]` | The events to track. Note that if you want to track the `STARTUP` event, you should initialize this class as soon as possible in your code, so that it can send the `STARTUP` event as soon as possible after the launcher is started. | No (defaults to all events) |

## `initialize()` method

Initialize the stats system. This method should be called as soon as possible in your code, and only once. It is recommended to call it before any other code, so that the `STARTUP` event can be sent as soon as possible after the launcher is started.

In case of a failure, the method will **not** throw an error, but will log the error to the console. This is to prevent the launcher from crashing if the stats system fails to initialize.

**Returns:** `Promise<void>`

## `attach()` method

Attach a stat provider to send stats from it to EML AdminTool.

| Parameter  | Type                                     | Description                  | Required? |
| ---------- | ---------------------------------------- | ---------------------------- | --------- |
| `provider` | `Bootstrap &#124; *Auth &#124; Launcher` | The stat provider to attach. | Yes       |

In case of failing to send stats, the method will **not** throw an error, but will log the error to the console. This is to prevent the launcher from crashing if the stats system fails to send stats.

**Returns:** `Promise<void>`
