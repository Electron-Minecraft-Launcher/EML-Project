---
title: MicrosoftAuth
description: API reference for the MicrosoftAuth class, used to authenticate players with a Microsoft account.
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

# MicrosoftAuth

`MicrosoftAuth` authenticates players using their Microsoft account. It opens a child browser window for the OAuth flow and returns an `Account` object on success.

> [!WARNING]
> `MicrosoftAuth` requires Electron. It cannot be used in a Node.js-only context.

> [!WARNING]
> Mojang accounts are no longer supported by Minecraft. All players must use a Microsoft account.

```js
import { MicrosoftAuth } from 'eml-lib'
import { app, BrowserWindow } from 'electron'

app.whenReady().then(authUser)

async function authUser() {
  const win = new BrowserWindow()
  const auth = new MicrosoftAuth(win)

  try {
    const account = await auth.auth()
    // store account and proceed to the home view
  } catch (err) {
    console.error(err)
  }
}
```

## Constructor

| Parameter  | Type                     | Description                                                                       | Required?                                         |
| ---------- | ------------------------ | --------------------------------------------------------------------------------- | ------------------------------------------------- |
| `window`   | `Electron.BrowserWindow` | The main Electron window. Used as the parent of the Microsoft login child window. | Yes                                               |
| `clientId` | `string`                 | Your Microsoft Azure application client ID.                                       | No (defaults to the official Minecraft client ID) |

## `auth()` method

Opens a child window for the Microsoft OAuth flow and authenticates the player.

**Returns:** `Promise<Account>`

**Throws:** `AUTH_ERROR` — If the authentication fails or the user closes the window.

## `validate()` method

Checks whether an existing account's access token is still valid.

| Parameter | Type      | Description              | Required? |
| --------- | --------- | ------------------------ | --------- |
| `user`    | `Account` | The account to validate. | Yes       |

**Returns:** `Promise<boolean>` — `true` if the token is valid, `false` if it has expired (call `refresh()` in that case).

## `refresh()`

Renews an expired access token without requiring the player to log in again.

| Parameter | Type      | Description             | Required? |
| --------- | --------- | ----------------------- | --------- |
| `user`    | `Account` | The account to refresh. | Yes       |

**Returns:** `Promise<Account>` — The account with updated tokens.

**Throws:** `AUTH_ERROR` — If the refresh fails (the player must log in again).
