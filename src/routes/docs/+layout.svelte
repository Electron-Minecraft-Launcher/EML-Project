<script lang="ts">
  import { page } from '$app/state'
  import { docsMenu } from '$lib/config/docs'
  import { copyCode } from '$lib/utils/copycode'
  import type { LayoutData } from '../$types'

  interface Props {
    data: LayoutData
    children?: import('svelte').Snippet
  }

  let { data, children }: Props = $props()

  let isDocMenuOpen = $state(false)
  let openSections = $state<boolean[]>(new Array(docsMenu.length).fill(false))

  function toggleDocMenu() {
    isDocMenuOpen = !isDocMenuOpen
  }

  $effect(() => {
    const currentPath = page.url.pathname

    isDocMenuOpen = false

    docsMenu.forEach((section, index) => {
      const containsActivePage = section.items.some((item) => currentPath.includes(item.slug))

      if (containsActivePage) {
        openSections[index] = true
      }
    })
  })
</script>

<div class="docs-layout">
  <aside class="sidebar" class:open={isDocMenuOpen}>
    <p class="table-of-contents">Table of Contents</p>
    <div class="sidebar-inner">
      {#each docsMenu as section, index}
        <details bind:open={openSections[index]}>
          <summary>&nbsp;&nbsp;{section.title}</summary>
          <ul>
            {#each section.items as item}
              <li>
                <a href="/docs/{item.slug}" class:active={page.url.pathname.split('/').slice(-1)[0] === item.slug}>
                  {item.title}
                </a>
              </li>
            {/each}
          </ul>
        </details>
      {/each}
    </div>
  </aside>

  {#if isDocMenuOpen}
    <div class="overlay" onclick={toggleDocMenu} role="button" tabindex="0" onkeydown={() => {}}></div>
  {/if}

  <div class="content-wrapper">
    <button class="doc-menu-button" onclick={toggleDocMenu}>
      <i class="fa-solid fa-list-ul"></i> Menu
    </button>

    <article class="markdown-body" use:copyCode={page.url.pathname}>
      {@render children?.()}
    </article>
  </div>
</div>

<style lang="scss">
  .docs-layout {
    display: grid;
    grid-template-columns: 330px 1fr;
    gap: 25px;
    width: calc(100% - 50px);
    margin: 2rem auto;
  }

  .sidebar {
    background: var(--background-light-color);
    border: 1px solid var(--border-color);
    border-radius: 10px;
    padding: 20px;
    position: sticky;
    top: 100px;
    overflow-y: auto;
    height: 100%;
    max-height: calc(100vh - 162px);

    p.table-of-contents {
      font-size: 1rem;
      color: #808080;
      margin-top: 0;
      margin-bottom: 1rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      font-weight: 650;
    }

    details {
      margin-bottom: 0.5rem;

      &[open] > summary {
        list-style-type: '\f077';
      }
    }

    summary {
      font-weight: 600;
      color: var(--text-dark-color);
      cursor: pointer;
      padding: 8px 12px;
      border-radius: 5px;
      transition: background 0.2s ease;
      font-family: 'Poppins', 'Font Awesome 7 Free';
      list-style-type: '\f078';

      &:hover {
        background: var(--secondary-color);
      }
    }

    ul {
      list-style: none;
      padding-left: 15px;
      margin-top: 10px;

      li a {
        display: block;
        text-decoration: none;
        color: #555;
        font-size: 0.9rem;
        padding: 6px 15px;
        border-radius: 0 5px 5px 0;
        border-left: 2px solid var(--border-color);
        border-bottom: none;
        transition:
          color 0.2s ease,
          background 0.2s ease,
          border-left-color 0.2s ease;
        line-height: 1.5;

        &:hover {
          background: var(--secondary-color);
          color: var(--text-dark-color);
          border-left-color: var(--primary-color);
        }

        &.active {
          background: var(--primary-tr-color-hover);
          color: var(--primary-color);
          font-weight: 500;
          border-left-color: var(--primary-color);
        }
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
    overflow-y: hidden;
  }

  .content-wrapper .markdown-body {
    max-width: 1000px;
    margin: 0 auto;
  }

  @media (max-width: 768px) {
    .docs-layout {
      display: block;
    }

    .sidebar {
      position: fixed;
      top: 0;
      left: 0;
      height: 100vh;
      z-index: 2000;
      transform: translateX(-100%);
      transition: transform 0.3s ease;
      box-shadow: 5px 0 15px rgba(0, 0, 0, 0.1);

      &.open {
        transform: translateX(0);
      }
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
