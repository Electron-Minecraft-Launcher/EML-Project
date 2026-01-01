<script lang="ts">
  import type { PageProps } from './$types'

  let { data }: PageProps = $props()
  let Content = $derived(data.content);
</script>

<svelte:head>
  <title>{data.meta?.title ? `${data.meta.title} — EML Docs` : 'Documentation'}</title>
</svelte:head>

<div class="doc-content">
  {#if data.meta?.title}
    <h1>{data.meta.title}</h1>
  {/if}

  <Content />
</div>

<style>
  h1 {
    margin-bottom: 1rem;
    font-size: 2.5rem;
    border-bottom: 1px solid var(--border);
    padding-bottom: 0.5rem;
  }
</style>