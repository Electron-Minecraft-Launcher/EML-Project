---
title: News
description: API reference for the News class, used to fetch news articles and categories from EML AdminTool for display in the launcher.
category: EML Lib — API Reference
author: Electron Minecraft Launcher
last-updated: 2026-05-03
---

<script>
  import Tabs from '$lib/components/Tabs.svelte';
  import TabItem from '$lib/components/TabItem.svelte';
  import CodeSwitch from '$lib/components/CodeSwitch.svelte';
  import CodeBlock from '$lib/components/CodeBlock.svelte';
</script>

# News

`News` fetches articles and categories published in EML AdminTool for display in the launcher's news feed.

> [!WARNING]
> `News` requires an EML AdminTool instance. It is not available in agnostic mode.

```js
import { News } from 'eml-lib'

getNews()

async function getNews() {
  const news = new News('https://at.myserver.com')

  try {
    const articles = await news.getNews()
    renderNewsFeed(articles)
  } catch (err) {
    console.error(err)
  }
}
```

## Constructor

| Parameter | Type     | Description                             | Required? |
| --------- | -------- | --------------------------------------- | --------- |
| `url`     | `string` | The URL of your EML AdminTool instance. | Yes       |

## `getNews()` method

Fetches all published news articles.

**Returns:** `Promise<INews[]>`

**Throws:** `FETCH_ERROR` — If the request to EML AdminTool fails.

## `getCategories()` method

Fetches all news categories.

**Returns:** `Promise<INewsCategory[]>`

**Throws:** `FETCH_ERROR` — If the request to EML AdminTool fails.

## ~~`getNewsByCategory()`~~ method

> [!WARNING]
> This method is deprecated and returns an empty array. Filter articles client-side instead: `news.getNews().then(articles => articles.filter(a => a.categoryId === id))`.
