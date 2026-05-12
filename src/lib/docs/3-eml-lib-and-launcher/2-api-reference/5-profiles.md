---
title: Profiles
description: API reference for the Profiles class, used to retrieve the list of profiles configured in EML AdminTool.
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

# Profiles

`Profiles` fetches the list of profiles configured in EML AdminTool. Use it to populate a profile selector in the launcher UI, then pass the selected `IProfile` to the `Launcher` constructor.

> [!WARNING]
> `Profiles` requires an EML AdminTool instance. It is not available in agnostic mode (self-hosted manifest without AdminTool).

```js
import { Profiles, Launcher } from 'eml-lib'

getProfiles()

async function getProfiles() {
  const profiles = new Profiles('https://at.myserver.com')
  const list = await profiles.getProfiles()
}
```

## Constructor

| Parameter | Type     | Description                             | Required? |
| --------- | -------- | --------------------------------------- | --------- |
| `url`     | `string` | The URL of your EML AdminTool instance. | Yes       |

## `getProfiles()` method

Fetches the list of all profiles available on the AdminTool.

**Returns:** `Promise<IProfile[]>` — An array of profile objects. The default profile is always included.

**Throws:** `FETCH_ERROR` — If the request to EML AdminTool fails.

> [!TIP]
> The `IProfile` objects returned by this method can be passed directly to the `profile` field of `Launcher`'s `Config`. The launcher uses the profile's `slug` to isolate game files in a dedicated subfolder.

