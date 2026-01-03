<script lang="ts">
  import { getContext, onMount, onDestroy } from 'svelte'
  import { TABS_KEY, type TabContext } from '../utils/tabs-ctx'

  interface Props {
    label: string
    children?: import('svelte').Snippet
  }

  let { label, children }: Props = $props()

  const ctx = getContext<TabContext>(TABS_KEY)

  onMount(() => {
    ctx.register(label)
  })

  onDestroy(() => {
    ctx.unregister(label)
  })

  let isActive = $derived(ctx.active.value === label)
</script>

<div class="tab-pane" class:active={isActive} hidden={!isActive}>
  {@render children?.()}
</div>

<style>
  .tab-pane {
    display: none;
  }

  .tab-pane.active {
    display: block;
    animation: fade-in 0.2s ease-in-out;
  }

  .tab-pane > *:first-child {
    margin-top: 0 !important;
  }

  .tab-pane > *:last-child {
    margin-bottom: 0 !important;
  }

  @keyframes fade-in {
    from {
      opacity: 0;
      transform: translateY(5px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>
