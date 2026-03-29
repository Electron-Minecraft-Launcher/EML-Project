<script lang="ts">
  import SEO from '$lib/components/SEO.svelte'
  import type { PageData } from './$types'

  let { data }: { data: PageData } = $props()

  const DEFAULT_HERO = '/images/blog/default-hero.webp'
</script>

<SEO title="Blog — EML Project" description="Follow the latest updates, releases and news about the Electron Minecraft Launcher project." />

<section class="hero small">
  <div class="container-layout">
    <p class="hero-title"><span>EML</span> Blog</p>
  </div>
</section>

<div class="container-layout" style="margin-bottom: 40px;">
  <div class="posts">
    {#each data.posts as post}
      <a href="/blog/{post.slug}" class="blog-card">
        <div class="card-hero" style="background-image: url('{post.meta.hero || DEFAULT_HERO}')"></div>

        <div class="card-content">
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
          </div>

          <h2 class="post-title">{post.meta.title}</h2>
          <p class="post-description">{post.meta.description}</p>

          {#if post.meta.tags}
            <div class="tags">
              {#each post.meta.tags as tag}
                <span class="tag">#{tag}</span>
              {/each}
            </div>
          {/if}
        </div>
      </a>
    {/each}
  </div>

  {#if data.posts.length === 0}
    <div class="empty-state">
      <p>No news yet. Stay tuned!</p>
    </div>
  {/if}
</div>

<style lang="scss" global>
  div.posts {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 30px;
    margin-top: 50px;

    .blog-card {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      background: white;
      border: 1px solid var(--border-color);
      border-radius: 10px;
      text-decoration: none;
      color: inherit;
      transition: all 0.2s ease;
      overflow: hidden;

      &:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.08);
        border-color: var(--primary-color);

        &:active {
          transform: translateY(1px);
        }
      }
    }

    .card-hero {
      width: 100%;
      aspect-ratio: 5 / 3;
      background-size: cover;
      background-position: center;
      border-bottom: 1px solid var(--border-color, #333);
    }

    .card-content {
      padding: 30px;
      display: flex;
      flex-direction: column;
      flex-grow: 1;

      h2.post-title {
        font-size: 1.2rem;
        margin: 15px 0;
        line-height: 1.4;
        font-weight: 600;
      }

      p.post-description {
        color: var(--text-muted);
        font-size: 0.95rem;
        margin: 0 0 15px 0;
        flex-grow: 1;
      }

      .meta-tags {
        display: flex;
        gap: 15px;
        color: var(--text-muted);
        font-size: 0.9rem;

        span {
          display: flex;
          align-items: center;
          gap: 6px;
        }
      }

      .tags {
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
        margin-top: auto;
      }

      .tag {
        background: #e5e5e5;
        color: var(--primary-color);
        padding: 4px 10px;
        border-radius: 6px;
        font-size: 0.8rem;
        font-weight: 500;
      }
    }

    .empty-state {
      grid-column: 1 / -1;
      text-align: center;
      padding: 4rem;
      color: var(--text-muted);
    }
  }

  @media (max-width: 768px) {
    div.posts {
      grid-template-columns: 1fr;
    }
  }
</style>
