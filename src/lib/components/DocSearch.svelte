<script lang="ts">
  import { onMount, tick } from 'svelte'
  import { goto } from '$app/navigation'
  import type { DocVersion } from '$lib/config/docs'

  interface Props {
    currentVersion: DocVersion
  }

  let { currentVersion }: Props = $props()

  interface SearchItem {
    id: string
    version: string
    title: string
    section: string
    slug: string
    url: string
    content: string
  }

  let isOpen = $state(false)
  let query = $state('')
  let searchIndex = $state<SearchItem[]>([])
  let selectedIndex = $state(0)
  let inputRef: HTMLInputElement | undefined

  let filteredResults = $derived.by(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []

    return searchIndex
      .map((item) => {
        const titleMatch = item.title.toLowerCase().indexOf(q)
        const sectionMatch = item.section.toLowerCase().indexOf(q)
        const contentMatch = item.content.toLowerCase().indexOf(q)

        let score = 0
        let snippet = ''

        if (titleMatch !== -1) score += 10
        if (sectionMatch !== -1) score += 5
        if (contentMatch !== -1) {
          score += 2
          const start = Math.max(0, contentMatch - 40)
          const end = Math.min(item.content.length, contentMatch + 80)
          snippet = (start > 0 ? '...' : '') + item.content.slice(start, end) + (end < item.content.length ? '...' : '')
        } else {
          snippet = item.content.slice(0, 100) + '...'
        }

        return { ...item, score, snippet }
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 8)
  })

  function portal(node: HTMLElement) {
    document.body.appendChild(node)
    return {
      destroy() {
        if (node.parentNode) {
          node.parentNode.removeChild(node)
        }
      }
    }
  }

  async function openSearch() {
    isOpen = true
    query = ''
    selectedIndex = 0
    if (searchIndex.length === 0) {
      try {
        const res = await fetch(`/api/search-index/${currentVersion}`)
        if (res.ok) {
          searchIndex = await res.json()
        }
      } catch (err) {
        console.error('Failed to load search index', err)
      }
    }
    await tick()
    inputRef?.focus()
  }

  function closeSearch() {
    isOpen = false
  }

  async function scrollToSelected() {
    await tick()
    const container = document.querySelector('.search-results') as HTMLElement
    if (!container) return

    const selectedItem = container.querySelectorAll('.result-item')[selectedIndex] as HTMLElement
    if (!selectedItem) return

    const itemTop = selectedItem.offsetTop
    const itemBottom = itemTop + selectedItem.offsetHeight
    const containerTop = container.scrollTop
    const containerBottom = containerTop + container.clientHeight

    if (itemTop < containerTop) {
      container.scrollTo({ top: itemTop - 10, behavior: 'smooth' })
    } 
    else if (itemBottom > containerBottom) {
      container.scrollTo({ top: itemBottom - container.clientHeight + 10, behavior: 'smooth' })
    }
  }

  function handleKeydown(e: KeyboardEvent) {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault()
      if (isOpen) closeSearch()
      else openSearch()
      return
    }

    if (!isOpen) return

    if (e.key === 'Escape') {
      closeSearch()
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (filteredResults.length > 0) {
        selectedIndex = (selectedIndex + 1) % filteredResults.length
        scrollToSelected()
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (filteredResults.length > 0) {
        selectedIndex = (selectedIndex - 1 + filteredResults.length) % filteredResults.length
        scrollToSelected()
      }
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (filteredResults[selectedIndex]) {
        goto(filteredResults[selectedIndex].url)
        closeSearch()
      }
    }
  }

  onMount(() => {
    window.addEventListener('keydown', handleKeydown)
    return () => window.removeEventListener('keydown', handleKeydown)
  })
</script>

<button class="search-trigger-btn" onclick={openSearch} type="button">
  <span class="search-label">
    <i class="fa-solid fa-magnifying-glass"></i>
    Search docs...
  </span>
  {#if navigator.userAgent.includes('Macintosh')}
    <kbd class="shortcut">⌘K</kbd>
  {:else}
    <kbd class="shortcut">Ctrl+K</kbd>
  {/if}
</button>

{#if isOpen}
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div class="search-backdrop" use:portal onclick={closeSearch}>
    <div class="search-modal" onclick={(e) => e.stopPropagation()}>
      <div class="search-input-wrapper">
        <i class="fa-solid fa-magnifying-glass search-icon"></i>
        <input
          bind:this={inputRef}
          bind:value={query}
          type="text"
          placeholder="Search topics, classes, commands..."
          autocomplete="off"
          spellcheck="false"
        />
        {#if query}
          <button class="clear-btn" onclick={() => (query = '')} type="button" aria-label="Clear search input">
            <i class="fa-solid fa-xmark"></i>
          </button>
        {/if}
      </div>

      <div class="search-results">
        {#if query && filteredResults.length === 0}
          <div class="empty-results">No results found for "<strong>{query}</strong>"</div>
        {:else if !query}
          <div class="search-hint">Type a keyword or class name to search...</div>
        {:else}
          {#each filteredResults as result, i}
            <a
              href={result.url}
              class="result-item"
              class:selected={i === selectedIndex}
              onclick={closeSearch}
              onmouseenter={() => (selectedIndex = i)}
            >
              <div class="result-header">
                <span class="result-section">{result.section}</span>
                <span class="result-title">{result.title}</span>
              </div>
              <p class="result-snippet">{result.snippet}</p>
            </a>
          {/each}
        {/if}
      </div>

      <div class="search-footer">
        <span><kbd>↑</kbd> <kbd>↓</kbd> to navigate</span>
        <span><kbd>↵</kbd> to select</span>
        <span><kbd>esc</kbd> to close</span>
      </div>
    </div>
  </div>
{/if}

<style lang="scss">
  .search-trigger-btn {
    width: calc(100% - 50px);
    margin: 0 auto 10px auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 12px;
    background: white;
    border: 1px solid var(--border-color);
    border-radius: 6px;
    color: var(--text-muted);
    font-size: 0.85rem;
    cursor: pointer;
    transition: all 0.2s ease;

    .search-label {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .shortcut {
      background: #eee;
      border: 1px solid #ddd;
      border-radius: 4px;
      padding: 2px 6px;
      font-size: 0.75rem;
      font-family: inherit;
      color: #666;
    }

    &:hover {
      border-color: var(--primary-color);
      color: var(--text-dark-color);
    }
  }

  .search-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(2px);
    z-index: 6000;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    padding-top: 10vh;
  }

  .search-modal {
    background: white;
    width: 100%;
    max-width: 600px;
    border-radius: 10px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
    border: 1px solid var(--border-color);
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  .search-input-wrapper {
    display: flex;
    align-items: center;
    padding: 14px 18px;
    border-bottom: 1px solid var(--border-color);
    gap: 12px;

    .search-icon {
      color: var(--text-muted);
      font-size: 1.1rem;
    }

    input {
      flex: 1;
      border: none;
      outline: none;
      font-size: 1.05rem;
      background: transparent;
      color: var(--text-dark-color);
      margin: 0;
      padding: 0;
      box-shadow: none;

      &:focus {
        outline: none !important;
      }
    }

    .clear-btn {
      background: none;
      border: none;
      color: var(--text-muted);
      cursor: pointer;
      padding: 4px;
    }
  }

  .search-results {
    max-height: 380px;
    overflow-y: auto;
    padding: 10px;
    display: flex;
    flex-direction: column;
    position: relative;
    gap: 4px;

    .empty-results,
    .search-hint {
      padding: 30px 20px;
      text-align: center;
      color: var(--text-muted);
      font-size: 0.95rem;
    }

    .result-item {
      display: flex;
      flex-direction: column;
      padding: 10px 14px;
      border-radius: 6px;
      text-decoration: none;
      color: inherit;
      border: none;
      transition: background 0.15s ease;

      &.selected {
        background: var(--secondary-color);

        .result-title {
          color: var(--primary-color);
        }
      }

      .result-header {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 4px;

        .result-section {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          background: #eee;
          padding: 2px 6px;
          border-radius: 4px;
          color: #666;
          font-weight: 600;
        }

        .result-title {
          font-weight: 600;
          font-size: 0.95rem;
          color: var(--text-dark-color);
        }
      }

      .result-snippet {
        font-size: 0.85rem;
        color: var(--text-muted);
        margin: 0;
        line-height: 1.4;
      }
    }
  }

  .search-footer {
    display: flex;
    justify-content: flex-end;
    gap: 16px;
    padding: 10px 18px;
    background: #fafafa;
    border-top: 1px solid var(--border-color);
    font-size: 0.75rem;
    color: var(--text-muted);

    kbd {
      background: white;
      border: 1px solid #ddd;
      border-radius: 3px;
      padding: 1px 5px;
    }
  }

  @media (max-width: 768px) {
    .search-trigger-btn {
      margin-top: 70px;
    }
  }
</style>
