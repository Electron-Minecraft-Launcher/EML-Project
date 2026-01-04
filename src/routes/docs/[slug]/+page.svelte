<script lang="ts">
  import SEO from '$lib/components/SEO.svelte'
  import { docsMenu } from '$lib/config/docs'
  import type { PageProps } from './$types'

  let { data }: PageProps = $props()
  let Content = $derived(data.content)

  const flatMenu = docsMenu.flatMap((section) => section.items)
  const meta = data.meta ?? {}

  let currentSlug = $derived(data.slug)

  let currentIndex = $derived(flatMenu.findIndex((item) => item.slug === currentSlug))
  let prevPage = $derived(currentIndex > 0 ? flatMenu[currentIndex - 1] : null)
  let nextPage = $derived(currentIndex < flatMenu.length - 1 ? flatMenu[currentIndex + 1] : null)
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
