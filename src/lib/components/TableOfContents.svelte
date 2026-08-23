<script lang="ts">
  import { page } from '$app/state'

  interface Heading {
    id: string
    text: string
    depth: number
  }

  let headings = $state<Heading[]>([])
  let activeId = $state<string>('')
  let observer: IntersectionObserver

  // S'exécute à chaque changement d'URL
  $effect(() => {
    page.url.pathname // Track la route

    // Léger délai pour s'assurer que le Markdown a bien été rendu dans le DOM
    const timeout = setTimeout(initTOC, 50)

    return () => {
      clearTimeout(timeout)
      if (observer) observer.disconnect()
    }
  })

  function initTOC() {
    const article = document.querySelector('.markdown-body')
    if (!article) return

    // Récupérer tous les h2 et h3
    const elements = Array.from(article.querySelectorAll('h2, h3'))

    headings = elements.map((el) => ({
      id: el.id,
      text: el.textContent || '',
      depth: Number(el.tagName.charAt(1))
    }))

    setupObserver(elements)
  }

  function setupObserver(elements: Element[]) {
    if (observer) observer.disconnect()

    // Configuration de l'observateur pour détecter quel titre est en haut de l'écran
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            activeId = entry.target.id
          }
        })
      },
      { rootMargin: '-100px 0px -70% 0px' }
    )

    elements.forEach((el) => observer.observe(el))
  }
</script>

{#if headings.length > 0}
  <aside class="toc-container">
    <p class="toc-title">On this page</p>
    <nav class="toc-nav">
      <ul>
        {#each headings as heading}
          <li class="depth-{heading.depth}">

            <a href="#{heading.id}" class:active={activeId === heading.id}>
              {heading.text}
            </a>
          </li>
        {/each}
      </ul>
    </nav>
  </aside>
{/if}

<style lang="scss">
  .toc-container {
    position: sticky;
    max-height: calc(100vh - 120px);
    overflow-y: auto;

    &::-webkit-scrollbar {
      width: 0px;
    }

    .toc-title {
      font-size: 0.85rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      font-weight: 650;
      color: var(--text-main);
      margin-bottom: 12px;
      margin-top: 0;
    }

    ul {
      list-style: none;
      padding: 0;
      margin: 0;
      border-left: 2px solid var(--border-color);
    }

    li {
      margin: 0;

      &.depth-3 a {
        padding-left: 30px;
        font-size: 0.8rem;
      }
    }

    a {
      display: block;
      padding: 6px 12px 6px 16px;
      color: var(--text-muted);
      text-decoration: none;
      font-size: 0.85rem;
      font-weight: 500;
      line-height: 1.4;
      border-bottom: none;
      transition: all 0.2s ease;
      position: relative;
      left: -2px;
      border-left: 2px solid transparent;

      &:hover {
        color: var(--text-dark-color);
      }

      &.active {
        color: var(--primary-color);
        border-left-color: var(--primary-color);
        font-weight: 600;
      }
    }
  }
</style>
