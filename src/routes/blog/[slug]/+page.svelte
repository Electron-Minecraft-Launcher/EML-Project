<script lang="ts">
  import SEO from '$lib/components/SEO.svelte'
  import type { PageData } from './$types'

  let { data }: { data: PageData } = $props()

  const DEFAULT_HERO = '/images/blog/default-hero.webp'
</script>

<SEO
  title="{data.meta.title} — EML Blog"
  description={data.meta.description}
  keywords={data.meta.keywords || []}
  image={data.meta.hero || DEFAULT_HERO}
  author={data.meta.author}
  publishedTime={data.meta.date}
  type="article"
/>

<article class="blog-post-container">
  <header class="post-header">
    <a href="/blog" class="back-link">
      <i class="fa-solid fa-arrow-left"></i> Back to blog
    </a>

    <h1 class="post-title">{data.meta.title}</h1>

    <div class="post-meta">
      {#if data.meta.author}
        <span class="author">{data.meta.author}</span>
        <span class="separator">•</span>
      {/if}
      <span class="date">
        {new Date(data.meta.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
      </span>
      {#if data.meta.tags}
        <span class="separator">•</span>
        <div class="tags">
          {#each data.meta.tags as tag}
            <span class="tag">{tag}</span>
          {/each}
        </div>
      {/if}
    </div>
  </header>

  <div class="post-hero" style="background-image: url('{data.meta.hero || DEFAULT_HERO}')"></div>

  <div class="doc-content">
    <data.content />
  </div>
</article>

<style lang="scss" global>
  @use 'highlight.js/styles/github.css';
  @use '../static/styles/markdown.scss';
  @use 'sass:meta';

  article {
    margin-bottom: 40px !important;
  }

  .blog-post-container {
    max-width: 800px;
    margin: 40px auto 100px auto;
    padding: 0 20px;

    .post-header {
      margin-bottom: 40px;

      .back-link {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        text-decoration: none;
        border-bottom: none;
        font-weight: 500;
        font-size: 0.95rem;
        margin-bottom: 30px;
        transition: color 0.2s;

        &:hover {
          color: var(--primary-color);
        }
      }

      .post-title {
        font-size: 3rem;
        font-weight: 650;
        line-height: 1.2;
        margin: 0 0 20px 0;
        letter-spacing: -0.5px;
      }

      .post-meta {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 8px;
        color: var(--text-muted);
        font-size: 0.95rem;

        .separator {
          opacity: 0.5;
        }

        .author {
          font-weight: 500;
          color: var(--text-main);
        }

        .tags {
          display: flex;
          gap: 8px;

          .tag {
            background: #e5e5e5;
            padding: 2px 8px;
            border-radius: 4px;
            font-size: 0.85rem;
            color: var(--text-muted);
          }
        }
      }
    }

    .post-hero {
      width: 100%;
      aspect-ratio: 16 / 9;
      background-size: cover;
      background-position: center;
      border-radius: 12px;
      margin-bottom: 50px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
      border: 1px solid var(--border-color, #333);
    }

    .doc-content {
      font-size: 1.1rem;
      line-height: 1.7;
      color: var(--text-main);

      :global {
        code {
          background: #eeeef0 !important;
        }
      }
    }
  }

  @media (max-width: 768px) {
    .blog-post-container {
      margin-top: 20px;

      .post-header {
        .post-title {
          font-size: 2.2rem;
        }
      }

      .post-hero {
        border-radius: 8px;
      }
    }
  }
</style>
