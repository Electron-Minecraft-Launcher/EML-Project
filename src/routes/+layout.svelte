<script lang="ts">
  import Footer from '$lib/components/Footer.svelte'
  import Header from '$lib/components/Header.svelte'
  import type { LayoutData } from './$types'

  interface Props {
    data: LayoutData
    children?: import('svelte').Snippet
  }

  let { data, children }: Props = $props()
</script>

<Header />
{@render children?.()}
<Footer />

<style lang="scss" global>
  @use '../../static/styles/styles.scss';
</style>
