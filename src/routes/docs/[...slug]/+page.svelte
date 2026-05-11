<script lang="ts">
  import SEO from '$lib/components/SEO.svelte'
  import { getFlatPages } from '$lib/config/docs'
  import type { PageProps } from './$types'

  let { data }: PageProps = $props()
  let Content = $derived(data.content)

  const flatPages = getFlatPages()
  const meta = data.meta ?? {}

  let currentIndex = $derived(flatPages.findIndex((p) => p.slug === data.slug))
  let prevPage = $derived(currentIndex > 0 ? flatPages[currentIndex - 1] : null)
  let nextPage = $derived(currentIndex < flatPages.length - 1 ? flatPages[currentIndex + 1] : null)
</script>

<SEO title={meta.title ? `${meta.title} — EML Docs` : 'EML Docs'} description={meta.description} type="article" publishedTime={meta.lastUpdated} />

<div class="doc-content">
  <Content />

  <div class="doc-nav">
    {#if prevPage}
      <a href="/docs/{prevPage.slug}" class="nav-button prev">
        <span><i class="fa-solid fa-arrow-left"></i> Previous</span>
        <strong>{prevPage.title}</strong>
      </a>
    {:else}
      <div></div>
    {/if}

    {#if nextPage}
      <a href="/docs/{nextPage.slug}" class="nav-button next">
        <span>Next <i class="fa-solid fa-arrow-right"></i></span>
        <strong>{nextPage.title}</strong>
      </a>
    {/if}
  </div>
</div>

<style lang="scss" global>
  @use 'highlight.js/styles/github.css';
  @use '../../../../static/styles/markdown.scss';
</style>
