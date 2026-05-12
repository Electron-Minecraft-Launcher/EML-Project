<script lang="ts">
  import { page } from '$app/state'
  import { docsMenu } from '$lib/config/docs'
  import { copyCode } from '$lib/utils/copycode'
  import { untrack } from 'svelte'
  import type { LayoutData } from '../$types'

  interface Props {
    data: LayoutData
    children?: import('svelte').Snippet
  }

  let { data, children }: Props = $props()

  const initial = computeOpenState(getSlug())
  let isDocMenuOpen = $state(false)
  let openSections = $state(initial.sections)
  let openGroups = $state(initial.groups)

  function toggleDocMenu() {
    isDocMenuOpen = !isDocMenuOpen
  }

  function getSlug(): string {
    const parts = page.url.pathname.split('/')
    let slug = ''
    for (let i = 2; i < parts.length; i++) {
      slug += (i > 2 ? '/' : '') + parts[i]
    }
    return slug
  }

  function groupKey(si: number, ei: number): string {
    return `${si}-${ei}`
  }

  function computeOpenState(slug: string) {
    const sections = new Array(docsMenu.length).fill(false)
    const groups: Record<string, boolean> = {}

    docsMenu.forEach((section, si) => {
      section.entries.forEach((entry, ei) => {
        if (entry.type === 'group') {
          groups[groupKey(si, ei)] = false
          if (entry.items.some((item) => item.slug === slug)) {
            sections[si] = true
            groups[groupKey(si, ei)] = true
          }
        } else if (entry.slug === slug) {
          sections[si] = true
        }
      })
    })

    return { sections, groups }
  }

  $effect(() => {
    page.url.pathname
    const slug = getSlug()

    untrack(() => {
      isDocMenuOpen = false

      docsMenu.forEach((section, si) => {
        section.entries.forEach((entry, ei) => {
          if (entry.type === 'page') {
            if (entry.slug === slug) openSections[si] = true
          } else {
            if (entry.items.some((item) => item.slug === slug)) {
              openSections[si] = true
              openGroups[groupKey(si, ei)] = true
            }
          }
        })
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
      {#each docsMenu as section, si}
        <details bind:open={openSections[si]}>
          <summary>&nbsp;&nbsp;{section.title}</summary>

          <div class="section-entries">
            {#each section.entries as entry, ei}
              {#if entry.type === 'page'}
                <a href="/docs/{entry.slug}" class="direct-link" class:active={getSlug() === entry.slug}>
                  {entry.title}
                </a>
              {:else}
                <details class="group" bind:open={openGroups[groupKey(si, ei)]}>
                  <summary class="group-summary">&nbsp;&nbsp;{entry.title}</summary>
                  {#each entry.items as item}
                    <a href="/docs/{item.slug}" class="group-item" class:active={getSlug() === item.slug}>
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
      padding: 8px 12px;
      border-radius: 5px;
      transition: background 0.2s ease;
      font-family: 'Poppins', 'Font Awesome 7 Free';
      list-style-type: '\f078';

      &:hover {
        background: var(--secondary-color);
      }
    }

    .section-entries {
      margin-top: 4px;
    }

    a {
      display: block;
      text-decoration: none;
      color: #555;
      font-weight: 500;
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

    details.group {
      margin-top: 2px;

      &[open] > summary.group-summary {
        list-style-type: '\f077';
      }
    }

    summary.group-summary {
      font-size: 0.9rem;
      font-weight: 600;
      letter-spacing: 0.6px;
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

      &:hover {
        background: var(--secondary-color);
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
