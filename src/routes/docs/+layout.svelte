<script lang="ts">
  import { page } from '$app/state'
  import { docsMenu, findSectionIndex } from '$lib/config/docs'
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

  function currentSlug() {
    return page.url.pathname.split('/').at(-1) ?? ''
  }

  $effect(() => {
    const slug = currentSlug()
    isDocMenuOpen = false

    openSections = openSections.map((_, index) => {
      return docsMenu[index].entries.some((entry) => {
        if (entry.type === 'page') return entry.slug === slug
        return entry.items.some((item) => item.slug === slug)
      })
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
    <p class="table-of-contents">Table of Contents</p>
    <button class="close" onclick={toggleDocMenu}><i class="fa-solid fa-times"></i></button>

    <div class="sidebar-inner">
      {#each docsMenu as section, sectionIndex}
        <details bind:open={openSections[sectionIndex]}>
          <summary>&nbsp;&nbsp;{section.title}</summary>

          <div class="section-entries">
            {#each section.entries as entry}
              {#if entry.type === 'page'}
                <a href="/docs/{entry.slug}" class="direct-link" class:active={currentSlug() === entry.slug}>
                  {entry.title}
                </a>
              {:else}
                <div class="group">
                  <span class="group-label">{entry.title}</span>
                  <ul>
                    {#each entry.items as item}
                      <li>
                        <a href="/docs/{item.slug}" class:active={currentSlug() === item.slug}>
                          {item.title}
                        </a>
                      </li>
                    {/each}
                  </ul>
                </div>
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

    button.close {
      display: none;
    }

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

    a.direct-link {
      display: block;
      text-decoration: none;
      color: #555;
      font-size: 0.9rem;
      padding: 6px 15px;
      margin: 2px 0 2px 15px;
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

    .section-entries {
      padding-left: 0;
      margin-top: 6px;
    }

    .group {
      margin-top: 4px;
    }

    .group-label {
      display: block;
      font-size: 0.72rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.6px;
      color: #999;
      padding: 8px 12px 4px 27px;
      user-select: none;
    }

    ul {
      list-style: none;
      padding-left: 15px;
      margin: 0 0 4px 0;

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
      transition:
        transform 0.3s ease,
        box-shadow 0.3s ease;
      overflow-y: auto;

      &.open {
        transition:
          transform 0.3s ease,
          box-shadow 0.3s ease;
        box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
        transform: translateX(0);
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
