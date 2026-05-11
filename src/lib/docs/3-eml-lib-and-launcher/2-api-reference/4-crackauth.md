---
title: CrackAuth
description: API reference for the CrackAuth class, used to create offline (cracked) accounts for development and testing.
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

# CrackAuth

`CrackAuth` generates an offline account from a username alone, without any server-side validation. It is synchronous and requires no network access.

> [!CAUTION]
> Offline accounts are not legally valid for players who own a genuine Minecraft licence. Using crack authentication in a public launcher violates Minecraft's Terms of Service. **Use `CrackAuth` for local development and testing only.** Use [MicrosoftAuth](/docs/eml-lib-and-launcher/api-reference/microsoftauth) in production.

```js
import { CrackAuth } from 'eml-lib'

const account = new CrackAuth().auth('TestPlayer')
// store account and proceed to the home view
```

## `auth()` method

Creates an offline `Account` from a username.

| Parameter  | Type     | Description                                               | Required? |
| ---------- | -------- | --------------------------------------------------------- | --------- |
| `username` | `string` | The player username. Must be between 3 and 16 characters. | Yes       |

**Returns:** `Account`

**Throws:** `AUTH_ERROR` — If the username is invalid (too short, too long, or contains illegal characters).

