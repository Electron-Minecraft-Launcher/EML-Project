---
title: CrashReports
description: API reference for the CrashReports class, used to send crash reports from your Minecraft launcher to EML AdminTool.
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

# CrashReports

`CrashReports` sends crash reports about the launcher to EML AdminTool.

> [!WARNING]
> `CrashReports` requires an EML AdminTool instance. It is not available in agnostic mode.

> [!NOTE]
> To be compliant with the [GDPR](https://en.wikipedia.org/wiki/General_Data_Protection_Regulation), **never send crash reports without** the user's consent. You should ask the user for consent before sending any crash reports, and only send crash reports if the user has given their consent. This class automatically hides the user's username and token from the crash report, so that it does not send any personally identifiable information.

```ts
import { CrashReports } from 'eml-lib'

sendCrashReports()

async function sendCrashReports() {
  const crashReports = new CrashReports('https://at.myserver.com')

  launcher.on('launch_crash', async (crashData) => { // `launcher` is an instance of the `Launcher` class
    try {
      await crashReports.send(launcher, crashData)
    } catch (err) {
      console.error('Failed to send crash report:', err)
    }
  })
}
```

Before sending any stats, the class performs a _handshake_ with the EML AdminTool instance. To prevent abuse, the server may reject the request if it is sent too frequently. The EML AdminTool allows a maximum of **1 handshake per 10 minutes** and **10 stats events per 10 minutes**. If the limit is exceeded, the server will respond with a `429 Too Many Requests` error.

## Constructor

| Parameter | Type     | Description                            | Required? |
| --------- | -------- | -------------------------------------- | --------- |
| `url`     | `string` | The URL of your EML AdminTool website. | Yes       |

## `send()` method

Send the crash report to EML AdminTool. This method should be called when the game crashes, and only if the user has given their consent to send crash reports. This method will read the latest.log file and the latest crash report file, sanitize them, and send them to the server.

| Parameter   | Type        | Description                                                        | Required? |
| ----------- | ----------- | ------------------------------------------------------------------ | --------- |
| `launcher`  | `Launcher`  | The Launcher instance used to launch the game.                     | Yes       |
| `crashData` | `CrashData` | The crash data emited by the `launch_crash` event of the Launcher. | Yes       |

**Returns:** `Promise<void>`

**Throws:** `FETCH_ERROR` — If the request to the server fails. • `UNKNOWN_ERROR` — In case of an unknown error.
