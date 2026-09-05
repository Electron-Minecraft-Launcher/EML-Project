<script lang="ts">
  import { page } from '$app/state'
  import { docsMenu, DEFAULT_VERSION, AVAILABLE_VERSIONS, type DocVersion } from '$lib/config/docs'
  import { copyCode } from '$lib/utils/copycode'
  import { untrack } from 'svelte'
  import type { LayoutData } from '../$types'
  import DocSearch from '$lib/components/DocSearch.svelte'
  import TableOfContents from '$lib/components/TableOfContents.svelte'

  interface Props {
    data: LayoutData
    children?: import('svelte').Snippet
  }

  let { data, children }: Props = $props()

  function getRouteInfo() {
    const parts = page.url.pathname.split('/').filter(Boolean)
    let version: DocVersion = DEFAULT_VERSION
    let slug = ''

    if (parts.length > 1 && AVAILABLE_VERSIONS.includes(parts[1] as DocVersion)) {
      version = parts[1] as DocVersion
      slug = parts.slice(2).join('/')
    } else {
      slug = parts.slice(1).join('/')
    }

    return { version, slug }
  }

  let routeInfo = $derived(getRouteInfo())
  let currentVersion = $derived(routeInfo.version)
  let currentSlug = $derived(routeInfo.slug)
  let currentMenu = $derived(docsMenu[currentVersion] ?? docsMenu[DEFAULT_VERSION])

  let isDocMenuOpen = $state(false)
  let openSections = $state<boolean[]>([])
  let openGroups = $state<Record<string, boolean>>({})

  function toggleDocMenu() {
    isDocMenuOpen = !isDocMenuOpen
  }

  function groupKey(si: number, ei: number): string {
    return `${si}-${ei}`
  }

  function expandActiveHierarchy(slug: string, version: DocVersion) {
    const menu = docsMenu[version] ?? docsMenu[DEFAULT_VERSION]

    if (openSections.length !== menu.length) {
      openSections = new Array(menu.length).fill(false)
    }

    menu.forEach((section, si) => {
      section.entries.forEach((entry, ei) => {
        if (entry.type === 'page') {
          if (entry.slug === slug) {
            openSections[si] = true
          }
        } else {
          const key = groupKey(si, ei)
          if (!(key in openGroups)) {
            openGroups[key] = false
          }
          if (entry.items.some((item) => item.slug === slug)) {
            openSections[si] = true
            openGroups[key] = true
          }
        }
      })
    })
  }

  $effect(() => {
    page.url.pathname
    const { slug, version } = getRouteInfo()
    untrack(() => {
      isDocMenuOpen = false
      expandActiveHierarchy(slug, version)
    })
  })
</script>

<section class="hero small">
  <div class="container-layout">
    <p class="hero-title"><span>EML</span> Docs</p>
  </div>
</section>

<div class="docs-layout">
  <aside class="sidebar" class:open={isDocMenuOpen}>
    <DocSearch {currentVersion} />
    <!-- svelte-ignore a11y_consider_explicit_label -->
    <button class="close" onclick={toggleDocMenu}><i class="fa-solid fa-times"></i></button>
    <div class="sidebar-inner">
      {#each currentMenu as section, si}
        <details bind:open={openSections[si]}>
          <summary>&nbsp;&nbsp;{section.title}</summary>
          <div class="section-entries">
            {#each section.entries as entry, ei}
              {#if entry.type === 'page'}
                <a href="/docs/{currentVersion}/{entry.slug}" class="direct-link" class:active={currentSlug === entry.slug}>
                  {entry.title}
                </a>
              {:else}
                <details class="group" bind:open={openGroups[groupKey(si, ei)]}>
                  <summary class="group-summary">&nbsp;&nbsp;{entry.title}</summary>
                  {#each entry.items as item}
                    <a href="/docs/{currentVersion}/{item.slug}" class="group-item" class:active={currentSlug === item.slug}>
                      {item.title}
                    </a>
                  {/each}
                </details>
              {/if}
            {/each}
          </div>
        </details>
      {/each}
    </div>
  </aside>

  {#if isDocMenuOpen}
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <div class="overlay" onclick={toggleDocMenu}></div>
  {/if}

  <div class="content-wrapper" class:home={currentSlug === ''}>
    <button class="doc-menu-button" onclick={toggleDocMenu}>
      <i class="fa-solid fa-list-ul"></i> Menu
    </button>
    <article class="markdown-body" use:copyCode={page.url.pathname}>
      {@render children?.()}
    </article>
    {#if currentSlug !== ''}
      <div class="right-sidebar">
        <TableOfContents />
      </div>
    {/if}
  </div>
</div>

<style lang="scss">
  .docs-layout {
    position: relative;
    display: grid;
    grid-template-columns: 310px 1fr;
    gap: 0;
    width: calc(100% - 25px);
    margin: 2rem 25px 2rem 0;
  }

  .sidebar {
    padding: 0;
    position: sticky;
    top: 89px;
    height: 100%;
    max-height: calc(100vh - 89px);

    button.close {
      display: none;
    }

    div.sidebar-inner {
      padding: 20px 25px;
      height: calc(100% - 89px);
      overflow-y: auto;
    }

    > div.sidebar-inner > details {
      margin-bottom: 0.5rem;

      &[open] > summary {
        list-style-type: '\f077';
      }
    }

    > div.sidebar-inner > details > summary {
      font-weight: 600;
      color: var(--text-dark-color);
      cursor: pointer;
      padding: 6px 12px;
      border-radius: 5px;
      transition: background 0.2s ease;
      font-family: 'Poppins', 'Font Awesome 7 Free';
      list-style-type: '\f078';

      &::marker {
        font-family: 'Font Awesome 7 Free';
        font-weight: 600;
      }

      &:hover {
        background: var(--secondary-color2);
      }
    }

    .right-sidebar {
      display: block;
    }

    .section-entries {
      margin-top: 4px;
    }

    a {
      display: block;
      text-decoration: none;
      color: #555;
      font-weight: 400;
      font-size: 0.8rem;
      padding: 6px 15px;
      margin: 0 0 0 15px;
      border-radius: 0 5px 5px 0;
      border-left: 2px solid var(--border-color);
      border-bottom: none;
      line-height: 1.5;
      transition:
        color 0.2s ease,
        background 0.2s ease,
        border-left-color 0.2s ease;

      &.group-item {
        margin-left: 30px;
      }

      &:hover {
        background: var(--secondary-color2);
        color: var(--text-dark-color);
        border-left-color: var(--primary-color);
      }

      &.active {
        background: var(--primary-tr-color-active);
        color: var(--primary-color);
        font-weight: 500;
        border-left-color: var(--primary-color);
      }
    }

    details.group {
      margin-top: 2px;

      &[open] > summary.group-summary {
        list-style-type: '\f077';
      }
    }

    summary.group-summary {
      font-size: 0.85rem;
      font-weight: 500;
      letter-spacing: 0.2px;
      color: #333;
      cursor: pointer;
      padding: 7px 12px 5px 12px;
      margin-left: 15px;
      border-radius: 5px;
      list-style-type: '\f078';
      font-family: 'Poppins', 'Font Awesome 7 Free';
      transition:
        background 0.2s ease,
        color 0.2s ease;

      &::marker {
        font-family: 'Font Awesome 7 Free';
        font-weight: 600;
      }

      &:hover {
        background: var(--secondary-color2);
      }
    }
  }

  .doc-menu-button {
    display: none;
    margin-bottom: 20px;
    background: var(--bg-card);
    border: 1px solid var(--border);
    width: 100%;
    text-align: left;
    color: var(--text-main);
  }

  .content-wrapper {
    background: var(--background-light-color);
    border: 1px solid var(--border-color);
    border-radius: 10px;
    padding: 40px;
    min-height: calc(100vh - 202px);
    display: grid;
    grid-template-columns: minmax(0, 1fr) 220px;
    gap: 40px;

    &.home {
      grid-template-columns: 1fr;
    }

    .markdown-body {
      max-width: 1000px;
      width: 100%;
      min-width: 0;
      margin: 0 auto;
    }

    .right-sidebar {
      position: sticky;
      top: 89px;
      height: fit-content;
    }
  }

  @media (max-width: 1100px) {
    .docs-layout {
      grid-template-columns: 280px minmax(0, 1fr);
    }
    .right-sidebar {
      display: none;
    }
  }

  @media (max-width: 768px) {
    .docs-layout {
      display: block;
      width: 100%;
      margin: 1rem auto;
    }

    .sidebar {
      position: fixed;
      top: 0;
      left: 0;
      min-height: 100vh;
      width: calc(100vw - 40px);
      border-radius: 0;
      border: none;
      z-index: 2000;
      transform: translateX(-100%);
      box-shadow: 0 0 15px rgba(0, 0, 0, 0);
      background: var(--background-light-color);
      transition:
        transform 0.3s ease,
        box-shadow 0.3s ease;
      overflow-y: hidden;

      &.open {
        box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
        transform: translateX(0);
      }

      .sidebar-inner {
        height: calc(100vh - 230px) !important;
      }

      button.close {
        display: block;
        position: absolute;
        top: 15px;
        right: 15px;
        background: transparent;
        border: none;
        font-size: 1rem;
        color: var(--text-dark-color);
        cursor: pointer;
      }
    }

    .content-wrapper {
      padding: 5%;
      border-radius: 0;
      border-left: none;
      border-right: none;
      display: block;
    }

    .doc-menu-button {
      display: block;
    }

    .overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      z-index: 1900;
    }
  }
</style>
