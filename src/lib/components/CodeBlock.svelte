<script lang="ts">
  import { getContext, onMount, onDestroy } from 'svelte'
  import { CODESWITCH_KEY, type CodeSwitchContext } from '../utils/codeswitch-ctx'

  interface Props {
    label: string
    children?: import('svelte').Snippet
  }

  let { label, children }: Props = $props()

  const ctx = getContext<CodeSwitchContext>(CODESWITCH_KEY)

  onMount(() => {
    ctx.register(label)
  })

  onDestroy(() => {
    ctx.unregister(label)
  })

  let isActive = $derived(ctx.active.value === label)
</script>

<div class="codeswitch-pane" class:active={isActive} hidden={!isActive}>
  {@render children?.()}
</div>

<style lang="scss">
  :global {
    .codeswitch-pane {
      code {
        border-radius: 0 0 5px 5px !important;
      }
    }
  }
  .codeswitch-pane {
    display: none;
    position: relative;

    &.active {
      display: block;
    }

    > *:first-child {
      margin-top: 0 !important;
    }

    > *:last-child {
      margin-bottom: 0 !important;
    }
  }
</style>
