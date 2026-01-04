<script lang="ts">
  import { onMount, setContext } from 'svelte'
  import { TABS_KEY, type TabContext } from '../utils/tabs-ctx'
  import { goto } from '$app/navigation'
  import { page } from '$app/state'

  interface Props {
    group?: string
    children?: import('svelte').Snippet
  }

  let { group, children }: Props = $props()

  let tabs = $state<string[]>([])
  let active = $state({ value: null as string | null })
  let containerRef: HTMLDivElement

  function updateUrl(label: string) {
    if (!group) return

    const url = new URL(page.url)
    url.searchParams.set(group, label.toLowerCase())

    goto(url.toString(), { replaceState: true, keepFocus: true, noScroll: true })
  }

  function getInitialTabFromUrl() {
    if (!group) return null

    const param = page.url.searchParams.get(group)
    if (!param) return null

    return tabs.find((t) => t.toLowerCase() === param.toLowerCase()) || null
  }

  function register(label: string) {
    if (tabs.includes(label)) return
    tabs.push(label)

    const urlTarget = getInitialTabFromUrl()
    if (urlTarget === label) {
      active.value = label
    } else if (active.value === null && !urlTarget) {
      active.value = label
    }
  }

  function unregister(label: string) {
    const index = tabs.indexOf(label)
    if (index !== -1) {
      tabs.splice(index, 1)
    }
    if (active.value === label) {
      active.value = tabs[0] ?? null
    }
  }

  function select(label: string) {
    active.value = label
    updateUrl(label)
  }

  onMount(() => {
    const hash = window.location.hash
    const urlTarget = getInitialTabFromUrl()

    if (urlTarget) {
      select(urlTarget)
    }

    if (hash && containerRef) {
      setTimeout(() => {
        const targetId = hash.substring(1)
        const targetElement = containerRef.querySelector(`[id="${targetId}"]`)

        if (targetElement) {
          const tabPane = targetElement.closest('[role="tabpanel"]')
          const labelToActivate = tabPane?.getAttribute('data-label')

          if (labelToActivate && labelToActivate !== active.value) {
            select(labelToActivate)
          }

          setTimeout(() => {
            const elementPosition = targetElement.getBoundingClientRect().top
            const offsetPosition = elementPosition + window.scrollY - 80

            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            })
          }, 100)
        }
      }, 100)
    }
  })

  setContext<TabContext>(TABS_KEY, {
    register,
    unregister,
    active,
    select
  })
</script>

<div class="tabs-container" bind:this={containerRef}>
  <div class="tabs-nav" role="tablist">
    {#each tabs as label}
      <button type="button" role="tab" class="tabs-nav-button" class:active={active.value === label} onclick={() => select(label)}>
        {label}
      </button>
    {/each}
  </div>

  <div class="tabs-content">
    {@render children?.()}
  </div>
</div>

<style>
  .tabs-container {
    margin: 24px 0;
    border-left: 1px solid var(--border-color);
    border-top: 1px solid var(--border-color);
    overflow: hidden;
  }

  .tabs-nav {
    display: flex;
    background-color: var(--background-color);
    border-bottom: 1px solid var(--border-color);
    border-right: 1px solid var(--border-color);
    padding: 5px 5px 0 5px;
    overflow-y: hidden;
  }

  .tabs-nav-button {
    padding: 10px 18px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    border-radius: 5px 5px 0 0 !important;
    background: transparent;
    color: #555;
    border-bottom: 3px solid transparent !important;
    margin-bottom: -1px;
    transition: all 0.2s ease;
  }

  .tabs-nav-button:hover {
    background-color: var(--secondary-color);
    color: var(--text-dark-color);
  }

  .tabs-nav-button.active {
    color: var(--primary-color);
    border-bottom-color: var(--primary-color) !important;
  }

  .tabs-content {
    padding: 20px 0 20px 20px;
  }
</style>
