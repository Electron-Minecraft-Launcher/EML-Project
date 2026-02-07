<script lang="ts">
  import SEO from '$lib/components/SEO.svelte'
  import type { PageData } from './$types'

  let { data }: { data: PageData } = $props()
</script>

<SEO title="Blog — EML Project" description="Follow the latest updates, releases and news about the Electron Minecraft Launcher project." />

<section class="hero small">
  <div class="container-layout">
    <p class="hero-title"><span>EML</span> Blog</p>
  </div>
</section>

<div class="container-layout">
  <div class="posts">
    {#each data.posts as post}
      <article class="blog-post">
        <header class="post-header">
          <div class="meta-tags">
            <span class="date">
              <i class="fa-solid fa-calendar"></i>
              {new Date(post.meta.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
            {#if post.meta.author}
              <span class="author">
                <i class="fa-solid fa-user"></i>
                {post.meta.author}
              </span>
            {/if}
            {#if post.meta.tags}
              <div class="tags">
                {#each post.meta.tags as tag}
                  <span class="tag">#{tag}</span>
                {/each}
              </div>
            {/if}
          </div>

          <h2 class="post-title">{post.meta.title}</h2>
        </header>

        <div class="doc-content">
          <post.content />
        </div>
      </article>
    {/each}
  </div>

  {#if data.posts.length === 0}
    <div class="empty-state">
      <p>No news yet. Stay tuned!</p>
    </div>
  {/if}
</div>

<style lang="scss" global>
  @use 'highlight.js/styles/github-dark.css';
  @use '../static/styles/markdown.scss';

  div.posts {
    display: flex;
    flex-direction: column;
    gap: 20px;

    .blog-post {
      background: var(--bg-card, #fff);
      border: 1px solid var(--border-color, #e5e7eb);
      border-radius: 8px;
      padding: 50px;
      transition: box-shadow 0.2s ease;

      &:first-of-type {
        margin-top: 50px;
      }
    }

    .post-header {
      margin-bottom: 2rem;

      h2.post-title {
        font-size: 2rem;
        margin-top: 10px;
        margin-bottom: 0;
        color: var(--text-main);
      }

      .meta-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 20px;
        color: var(--text-muted);
        font-size: 0.95rem;
        margin-bottom: 10px;

        span {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .tags {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .tag {
          background: var(--secondary-color);
          color: var(--primary-color);
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 0.8rem;
          font-weight: 600;
        }
      }
    }

    h1, h2, h3, h4, h5 {
      a::before {
        display: none;
      }
    }

    .empty-state {
      text-align: center;
      padding: 4rem;
      color: var(--text-muted);
      font-size: 1.2rem;
    }
  }

  @media (max-width: 768px) {
    .post-header h2 {
      font-size: 1.8rem;
    }

    .blog-container {
      margin: 1.5rem auto;
    }
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>
