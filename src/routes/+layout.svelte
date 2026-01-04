<script lang="ts">
  import Footer from '$lib/components/Footer.svelte'
  import Header from '$lib/components/Header.svelte'
  import type { LayoutData } from './$types'
  import { onNavigate, afterNavigate } from '$app/navigation'
  import { page } from '$app/state'
  import { dev } from '$app/environment'

  interface Props {
    data: LayoutData
    children?: import('svelte').Snippet
  }

  let { data, children }: Props = $props()

  // afterNavigate(() => {
  //   if (!dev && typeof window.gtag !== 'undefined') {
  //     window.gtag('config', 'G-7G31KJ2ZE8', {
  //       page_path: window.location.pathname + window.location.search
  //     })
  //   }
  // })
</script>

<Header />
{@render children?.()}
<Footer />

<style lang="scss" global>
  @use '../../static/styles/styles.scss';
</style>
