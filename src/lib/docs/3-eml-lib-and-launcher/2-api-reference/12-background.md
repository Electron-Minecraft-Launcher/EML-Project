---
title: Background
description: API reference for the Background class, used to fetch the current launcher background image from EML AdminTool.
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

# Background

`Background` fetches the background image currently set in EML AdminTool. Apply it to the launcher window on startup. Always implement a fallback for when no background is configured.

> [!WARNING]
> `Background` requires an EML AdminTool instance. It is not available in agnostic mode.

```js
import { Background } from 'eml-lib'

getBackground()

async function getBackground() {
  const background = new Background('https://at.myserver.com')

  try {
    const bg = await background.getBackground()

    if (bg !== null) {
      document.body.style.backgroundImage = `url('${bg.url}')`
    }
    // else: keep your launcher's default background
  } catch (err) {
    console.error(err)
  }
}
```

## Constructor

| Parameter | Type     | Description                             | Required? |
| --------- | -------- | --------------------------------------- | --------- |
| `url`     | `string` | The URL of your EML AdminTool instance. | Yes       |

## `getBackground()` method

Fetches the currently active background from EML AdminTool.

**Returns:** `Promise<IBackground>` — The background data if a background is set. • `Promise<null>` — If no background has been set (use your launcher's default).

**Throws:** `FETCH_ERROR` — If the request to EML AdminTool fails.
