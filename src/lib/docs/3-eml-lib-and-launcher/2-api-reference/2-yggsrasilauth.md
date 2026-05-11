---
title: YggdrasilAuth
description: API reference for the YggdrasilAuth class, used to authenticate players against a custom Yggdrasil-compatible authentication server.
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

# YggdrasilAuth

`YggdrasilAuth` authenticates players against a custom Yggdrasil-compatible server. This is useful if you run a private authentication service that implements the Yggdrasil protocol.

> [!WARNING]
> The official Mojang Yggdrasil endpoint has been deprecated. This class is intended for use with community-maintained or self-hosted Yggdrasil implementations. Ensure that your server validates Minecraft account ownership to comply with Minecraft's Terms of Service.

```js
import { YggdrasilAuth } from 'eml-lib'

authUser()

async function authUser() {
  const auth = new YggdrasilAuth('https://auth.myserver.com')

  try {
    const result = await auth.auth('GoldFrite', 'MyPassword123')

    // Handle multiple profiles if needed
    if ('profiles' in result) {
      const account = auth.selectProfile(result, { name: 'GoldFrite' })
      // store account and proceed to the home view
    } else {
      const account = result
      // store account and proceed to the home view
    }
  } catch (err) {
    console.error(err)
  }
}
```

## Constructor

| Parameter | Type     | Description                            | Required? |
| --------- | -------- | -------------------------------------- | --------- |
| `url`     | `string` | The base URL of your Yggdrasil server. | Yes       |

## `auth()` method

Authenticates a player with username and password.

| Parameter  | Type     | Description                     | Required? |
| ---------- | -------- | ------------------------------- | --------- |
| `username` | `string` | The player's username or email. | Yes       |
| `password` | `string` | The player's password.          | Yes       |

**Returns:** `Promise<Account | MultipleProfiles>` — Returns an `Account` directly if the user has a single profile. Returns a `MultipleProfiles` object if the account has several profiles; call `selectProfile()` to resolve it.

**Throws:** `AUTH_ERROR` — If authentication fails.

## `selectProfile()` method

Selects a profile from a `MultipleProfiles` result.

| Parameter  | Type                             | Description                                                                   | Required? |
| ---------- | -------------------------------- | ----------------------------------------------------------------------------- | --------- |
| `profiles` | `MultipleProfiles`               | The object returned by `auth()` when multiple profiles exist.                 | Yes       |
| `select`   | `{ id?: string, name?: string }` | The profile to select, by ID or name. If both are given, ID takes precedence. | Yes       |

**Returns:** `Account`

**Throws:** `AUTH_ERROR` — If the specified profile does not exist.

## `validate()` method

Checks whether an account's access token is still valid.

| Parameter | Type      | Description              | Required? |
| --------- | --------- | ------------------------ | --------- |
| `user`    | `Account` | The account to validate. | Yes       |

**Returns:** `Promise<boolean>` — `true` if valid, `false` if expired.

## `refresh()` method

Renews an expired access token.

| Parameter | Type      | Description             | Required? |
| --------- | --------- | ----------------------- | --------- |
| `user`    | `Account` | The account to refresh. | Yes       |

**Returns:** `Promise<Account>`

**Throws:** `AUTH_ERROR` — If the refresh fails.

## `logout()` method

Invalidates the current session token for the given account.

> [!NOTE]
> This method uses the `invalidate` endpoint, which invalidates only the current session. It does not call `signout`, which would invalidate all active sessions for the account.

| Parameter | Type      | Description             | Required? |
| --------- | --------- | ----------------------- | --------- |
| `user`    | `Account` | The account to log out. | Yes       |

**Returns:** `Promise<void>`

**Throws:** `AUTH_ERROR` — If the logout fails.

