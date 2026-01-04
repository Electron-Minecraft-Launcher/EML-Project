<script lang="ts">
  import { page } from '$app/state'

  interface Props {
    title: string
    description?: string
    image?: string
    type?: 'website' | 'article'
    author?: string
    publishedTime?: string
  }

  let {
    title,
    description = 'EML Project is an open-source, modular infrastructure designed for server administrators to create, secure, and distribute custom Minecraft launchers.',
    image = 'https://emlproject.pages.dev/images/og-image-default.png',
    type = 'website',
    author = 'Electron Minecraft Launcher',
    publishedTime
  }: Props = $props()

  const siteTitle = 'EML Project'
  const finalTitle = title === siteTitle ? title : `${title}`
  const canonicalUrl = $derived(`https://emlproject.pages.dev${page.url.pathname}`)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': type === 'article' ? 'TechArticle' : 'WebSite',
    headline: title,
    description: description,
    author: {
      '@type': 'Organization',
      name: author
    },
    url: canonicalUrl
  }
</script>

<svelte:head>
  <title>{finalTitle}</title>
  <meta name="description" content={description} />
  <link rel="canonical" href={canonicalUrl} />
  <meta name="robots" content="index, follow" />

  <meta property="og:type" content={type} />
  <meta property="og:title" content={finalTitle} />
  <meta property="og:description" content={description} />
  <meta property="og:url" content={canonicalUrl} />
  <meta property="og:image" content={image} />
  <meta property="og:site_name" content={siteTitle} />

  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={finalTitle} />
  <meta name="twitter:description" content={description} />
  <meta name="twitter:image" content={image} />

  {#if type === 'article' && publishedTime}
    <meta property="article:published_time" content={publishedTime} />
    <meta property="article:author" content={author} />
  {/if}

  {@html `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`}
</svelte:head>
