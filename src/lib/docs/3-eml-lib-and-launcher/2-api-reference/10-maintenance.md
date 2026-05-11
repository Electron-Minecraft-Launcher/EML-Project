---
title: Maintenance
description: API reference for the Maintenance class, used to check whether the server administrator has enabled maintenance mode.
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

# Maintenance

`Maintenance` checks whether maintenance mode is currently active on EML AdminTool. When it is, you are responsible for blocking the launcher and displaying the maintenance screen.

> [!WARNING]
> `Maintenance` requires an EML AdminTool instance. It is not available in agnostic mode.

Call `getMaintenance()` at startup, before showing the home view.

```js
import { Maintenance } from 'eml-lib'

applyMaintenanceStatus()

async function applyMaintenanceStatus() {
  const maintenance = new Maintenance('https://at.myserver.com')

  try {
    const status = await maintenance.getMaintenance()

    if (status !== null) {
      showMaintenanceView(status.message)
    } else {
      showHomeView()
    }
  } catch (err) {
    console.error(err)
  }
}
```

## Constructor

| Parameter | Type     | Description                             | Required? |
| --------- | -------- | --------------------------------------- | --------- |
| `url`     | `string` | The URL of your EML AdminTool instance. | Yes       |

## Methods

### `getMaintenance()`

Fetches the current maintenance status from EML AdminTool.

**Returns:** `Promise<null>` — If no maintenance is active. • `Promise<IMaintenance>` — If maintenance is active.

**Throws:** `FETCH_ERROR` — If the request to EML AdminTool fails.

