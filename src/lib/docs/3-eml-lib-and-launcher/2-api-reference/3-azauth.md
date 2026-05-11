---
title: AzAuth
description: API reference for the AzAuth class, used to authenticate players with an Azuriom website account.
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

# AzAuth

`AzAuth` authenticates players using their account on an [Azuriom](https://azuriom.com/) website. It requires the **Auth API** plugin to be enabled in Azuriom's admin panel.

> [!WARNING]
> You must verify the player's access token server-side when they connect to your Minecraft server. See the `verify` endpoint in the [Azuriom Auth API documentation](https://azuriom.com/docs/api-auth).

```js
import { AzAuth } from 'eml-lib'

authUser()

async function authUser() {
  const auth = new AzAuth('https://myserver.com')

  try {
    const account = await auth.auth('GoldFrite', 'MyPassword123')
    // store account and proceed to the home view
  } catch (err) {
    if (err.code === 'TWOFA_CODE_REQUIRED') {
      const account = await auth.auth('GoldFrite', 'MyPassword123', '123456')
      // store account and proceed to the home view
    } else {
      console.error(err)
    }
  }
}
```

## Constructor

| Parameter | Type     | Description                           | Required? |
| --------- | -------- | ------------------------------------- | --------- |
| `url`     | `string` | The base URL of your Azuriom website. | Yes       |

## `auth()` method

Authenticates a player with their Azuriom credentials.

| Parameter   | Type     | Description                         | Required? |
| ----------- | -------- | ----------------------------------- | --------- |
| `username`  | `string` | The player's username or email.     | Yes       |
| `password`  | `string` | The player's password.              | Yes       |
| `twoFACode` | `string` | The two-factor authentication code. | No        |

**Returns:** `Promise<Account>`

**Throws:** `TWOFA_CODE_REQUIRED` — If two-factor authentication is enabled and no code was provided. • `AUTH_ERROR` — If authentication fails.

## `verify()` method

Verifies that an existing account's token is still valid against the Azuriom server.

| Parameter | Type      | Description            | Required? |
| --------- | --------- | ---------------------- | --------- |
| `user`    | `Account` | The account to verify. | Yes       |

**Returns:** `Promise<Account>` — The account with refreshed data.

**Throws:** `AUTH_ERROR` — If verification fails.

## `logout()` method

Logs out a player from Azuriom.

| Parameter | Type      | Description             | Required? |
| --------- | --------- | ----------------------- | --------- |
| `user`    | `Account` | The account to log out. | Yes       |

**Returns:** `Promise<void>`

**Throws:** `AUTH_ERROR` — If the logout fails.

