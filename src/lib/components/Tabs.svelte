<script lang="ts">
  import { setContext } from 'svelte'
  import { TABS_KEY, type TabContext } from '../utils/tabs-ctx'

  interface Props {
    children?: import('svelte').Snippet
  }

  let { children }: Props = $props()

  let tabs = $state<string[]>([])
  let active = $state({ value: null as string | null })

  function register(label: string) {
    if (tabs.includes(label)) return

    tabs.push(label)

    if (active.value === null) {
      active.value = label
    }
  }

  function unregister(label: string) {
    const index = tabs.indexOf(label)
    if (index !== -1) {
      tabs.splice(index, 1)
    }
    if (active.value === label) {
      active.value = tabs[0] || null
    }
  }

  function select(label: string) {
    active.value = label
  }

  setContext<TabContext>(TABS_KEY, {
    register,
    unregister,
    active,
    select
  })
</script>

<div class="tabs-container">
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
