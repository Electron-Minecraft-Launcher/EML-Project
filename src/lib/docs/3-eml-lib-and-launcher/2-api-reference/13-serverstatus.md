---
title: ServerStatus
description: API reference for the ServerStatus class, used to check whether a Minecraft server is online and retrieve its player count.
category: EML Lib and Launcher — API Reference
author: Electron Minecraft Launcher
last-updated: 2026-05-03
---

<script>
  import Tabs from '$lib/components/Tabs.svelte';
  import TabItem from '$lib/components/TabItem.svelte';
  import CodeSwitch from '$lib/components/CodeSwitch.svelte';
  import CodeBlock from '$lib/components/CodeBlock.svelte';
</script>

# ServerStatus

`ServerStatus` pings a Minecraft server and returns its current status: whether it is online, how many players are connected, and the server's MOTD.

`ServerStatus` communicates directly with the Minecraft server over TCP. It does not require EML AdminTool.

```ts
import { ServerStatus } from 'eml-lib'

pingServer()

async function pingServer() {
  const status = new ServerStatus('play.myserver.com', 25565)

  try {
    const info = await status.getStatus()
    console.log(`${info.players.online}/${info.players.max} players online`)
  } catch (err) {
    // Server is offline or unreachable
    console.log('Server offline')
  }
}
```

## Constructor

| Parameter  | Type                                              | Description                                                                                                                                                                                                           | Required?                   |
| ---------- | ------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------- |
| `ip`       | `string`                                          | The Minecraft server IP or hostname.                                                                                                                                                                                  | Yes                         |
| `port`     | `number`                                          | The Minecraft server port.                                                                                                                                                                                            | No (defaults to `25565`)    |
| `protocol` | `'modern' \| '1.6' \| '1.4-1.5' \| 'beta1.8-1.3'` | The Minecraft network protocol version. Use `'modern'` for any version from 1.7 (13w41a) onward.                                                                                                                      | No (defaults to `'modern'`) |
| `pvn`      | `number`                                          | The Minecraft protocol version number (e.g. `767` for 1.21). Improves compatibility. You can find the protocol version for your Minecraft version on the [Minecraft Wiki](https://minecraft.wiki/w/Protocol_version). | No (defaults to `-1`)       |
| `timeout`  | `number`                                          | Connection timeout in seconds.                                                                                                                                                                                        | No (defaults to `5`)        |

## `getStatus()` method

Pings the server and retrieves its status.

**Returns:** `Promise<IServerStatus>`

**Throws:** `NET_ERROR` — If the server is unreachable, the connection times out, or the server returns an invalid response.
