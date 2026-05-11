---
title: Skins
description: API reference for the Skins class, used to fetch a player's Minecraft skin and cape data for display in the launcher.
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

# Skin

`Skin` fetches the skin and cape data associated with a player's account from your authentication server. Use it to display the player's skin head or full body in the launcher UI.

This class works with Microsoft accounts, Yggdrasil accounts (Drasl server is recommended) and Azuriom accounts.

```ts
import { Skin } from 'eml-lib'

getSkins()

async function getSkins() {
  const skin = new Skin(account)

  try {
    const skins = await skin.getSkins()
    const capes = await skin.getCapes()
  } catch (err) {
    console.error(err)
  }
}
```

## Constructor

| Parameter | Type      | Description                                                                                                              | Required? |
| --------- | --------- | ------------------------------------------------------------------------------------------------------------------------ | --------- |
| `account` | `Account` | The authenticated player account. Must be a Microsoft or Yggdrasil account — offline (crack) accounts have no skin data. | Yes       |

## `getSkin()` method

Get the player's skin. If the player has no skin, an empty array is returned.

> [!NOTE]
> Data returned by this method may be cached. Call `reload()` to fetch the latest data from the server.

| Field    | Type      | Description                                                                                                                                        | Required?                |
| -------- | --------- | -------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------ |
| `active` | `boolean` | Whether to only return the active skin (i.e., the skin currently used by the player). If `false`, all skins are returned, including inactive ones. | No (defaults to `false`) |

**Returns:** `Promise<ISkin[]>` — The list of the player's skins.

**Throws:** `FETCH_ERROR` — If the request to server fails. • `TOO_MANY_REQUESTS` — If the client has made too many requests to the server. • `CONFIG_ERROR` — If the account type is not supported by this class.

## `getCapes()` method

Get the player's capes. If the player has no capes, an empty array is returned.

> [!NOTE]
> Data returned by this method may be cached. Call `reload()` to fetch the latest data from the server.

| Field    | Type      | Description                                                                                                                                        | Required?                |
| -------- | --------- | -------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------ |
| `active` | `boolean` | Whether to only return the active cape (i.e., the cape currently used by the player). If `false`, all capes are returned, including inactive ones. | No (defaults to `false`) |

**Returns:** `Promise<ICape[]>` — The list of the player's capes.

**Throws:** `FETCH_ERROR` — If the request to server fails. • `TOO_MANY_REQUESTS` — If the client has made too many requests to the server. • `CONFIG_ERROR` — If the account type is not supported by this class.

## `getAvatar()` method

Get the player's avatar. If the player has no avatar, `null` is returned.

> [!NOTE]
> Data returned by this method may be cached. Call `reload()` to fetch the latest data from the server.

**Returns:** `Promise<IAvatar>` — The player's avatar if it exists. • `Promise<null>` — If the player has no avatar.

**Throws:** `FETCH_ERROR` — If the request to server fails. • `TOO_MANY_REQUESTS` — If the client has made too many requests to the server. • `CONFIG_ERROR` — If the account type is not supported by this class.

## `reload()` method

Reload the player's skin, cape and avatar data from the server. This is useful to get the latest data after the player has changed their skin or cape, or if you want to make sure you have the latest data from the server.

**Returns:** `Promise<void>`

**Throws:** `FETCH_ERROR` — If the request to server fails. • `TOO_MANY_REQUESTS` — If the client has made too many requests to the server. • `CONFIG_ERROR` — If the account type is not supported by this class.

## `updateSkin()` method

Upload a new skin for the player and activate it. Cache is automatically updated after a successful update.

| Parameter | Type                     | Description                                                                                                                                                                                                                    | Required?                    |
| --------- | ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------- |
| `source`  | `string \| File \| Blob` | The source file of the skin. The image should be a `.png` file of the skin, and must follow the standard Minecraft skin format (64x64 pixels, or 64x32 pixels for legacy skins). You can also provide a URL to the skin image. | Yes                          |
| `variant` | `'classic' \| 'slim'`    | The skin variant to use. This is only relevant for Minecraft accounts that have both a classic and a slim skin. If the account only has one skin variant, this parameter is ignored.                                           | No (defaults to `'classic'`) |

**Returns:** `Promise<void>`

**Throws:** `FETCH_ERROR` — If the request to server fails. • `TOO_MANY_REQUESTS` — If the client has made too many requests to the server. • `CONFIG_ERROR` — If the account type is not supported by this class.

## `updateCape()` method

Upload a new cape for the player and activate it. Cache is automatically updated after a successful update.

> [!WARNING]
> This method only works for Azuriom accounts.

| Parameter | Type                     | Description                                                                                                                                                                                  | Required? |
| --------- | ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- |
| `source`  | `string \| File \| Blob` | The source file of the cape. The image should be a `.png` file of the cape, and must follow the standard Minecraft cape format (64x32 pixels). You can also provide a URL to the cape image. | Yes       |

**Returns:** `Promise<void>`

**Throws:** `FETCH_ERROR` — If the request to server fails. • `CONFIG_ERROR` — If the account type is not supported by this class, or if the account doesn't have permission to upload a cape.

## `deleteCape()` method

Delete the player's cape. Cache is automatically updated after a successful update.

> [!WARNING]
> Microsoft accounts doesn't allow custom capes. Please use `hideCape()` to hide the player's cape instead of deleting it, as they don't support deleting capes.

**Returns:** `Promise<void>`

**Throws:** `FETCH_ERROR` — If the request to server fails. • `CONFIG_ERROR` — If the account type is not supported by this class, or if the account doesn't have permission to delete a cape.

## `switchCape()` method

Switch the player's active cape.

> [!NOTE]
> This method only works for Microsoft accounts. Please use `updateCape()` to update the cape for other account types, as they don't support multiple capes.

| Parameter | Type     | Description                                                                                                           | Required? |
| --------- | -------- | --------------------------------------------------------------------------------------------------------------------- | --------- |
| `capeId`  | `string` | The ID of the cape to activate. You can get the list of the player's capes and their IDs with the `getCape()` method. | Yes       |

**Returns:** `Promise<void>`

**Throws:** `FETCH_ERROR` — If the request to server fails. • `CONFIG_ERROR` — If the account type is not supported by this method, or if the account doesn't have permission to switch capes.

## `hideCape()` method

Hide the player's cape. Cache is automatically updated after a successful update.

> [!NOTE]
> This method only works for Microsoft accounts. Please use `deleteCape()` to delete the cape for other account types, as they don't support hiding capes.

**Returns:** `Promise<void>`

**Throws:** `FETCH_ERROR` — If the request to server fails. • `TOO_MANY_REQUESTS` — If the client has made too many requests to the server. • `CONFIG_ERROR` — If the account type is not supported by this method, or if the account doesn't have permission to hide capes.
