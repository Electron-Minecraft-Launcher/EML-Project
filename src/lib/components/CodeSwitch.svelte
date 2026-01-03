<script lang="ts">
  import { setContext } from 'svelte'
  import { CODESWITCH_KEY, type CodeSwitchContext } from '../utils/codeswitch-ctx'

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

  setContext<CodeSwitchContext>(CODESWITCH_KEY, {
    register,
    unregister,
    active,
    select
  })
</script>

<div class="condeswitch-container">
  <div class="codeswitch-nav" role="tablist">
    {#each tabs as label}
      <button type="button" role="tab" class="codeswitch-nav-button" class:active={active.value === label} onclick={() => select(label)}>
        {label}
      </button>
    {/each}
  </div>

  <div class="codeswitch-content">
    {@render children?.()}
  </div>
</div>

<style>
  .codeswitch-container {
    margin: 16px 0;
    border-radius: 5px;
    overflow: hidden;
    background-color: var(--background-color);
  }

  .codeswitch-nav {
    display: flex;
    background-color: #f3f4f6;
    border-bottom: 1px solid var(--border-color);
    padding: 0;
    border-radius: 5px 5px 0 0;
  }

  .codeswitch-nav-button {
    padding: 8px 16px;
    font-size: 13px;
    font-family: 'Poppins', sans-serif;
    font-weight: 600;
    color: #666;
    background: transparent;
    border: none;
    border-radius: 5px 5px 0 0 !important;
    cursor: pointer;
    border-bottom: 2px solid transparent !important;
    transition: all 0.2s ease;
    opacity: 0.7;
  }

  .codeswitch-nav-button:hover {
    opacity: 1;
    background-color: rgba(0, 0, 0, 0.03);
  }

  .codeswitch-nav-button.active {
    color: var(--primary-color);
    border-bottom-color: var(--primary-color) !important;
    opacity: 1;
  }

  .codeswitch-content {
    position: relative;
  }
</style>
