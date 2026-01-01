<script lang="ts">
  import { page } from '$app/state'

  let isMenuOpen = $state(false)

  function toggleMenu() {
    isMenuOpen = !isMenuOpen
  }

  $effect(() => {
    isMenuOpen = false
  })
</script>

<header>
  <div class="container-layout">
    <a href="/" class="logo not-a">
      EML<span>Project</span>
    </a>

    <nav>
      <button class="mobile-menu-btn" onclick={toggleMenu} aria-label="Toggle menu">
        <i class="fa-solid {isMenuOpen ? 'fa-times' : 'fa-bars'}"></i>
      </button>

      <ul class="nav-links" class:active={isMenuOpen}>
        <li>
          <a href="/" class:active={page.url.pathname === '/'}>Home</a>
        </li>
        <li>
          <a href="/docs" class:active={page.url.pathname.startsWith('/docs')}>Docs</a>
        </li>
        <li>
          <a href="https://github.com/Electron-Minecraft-Launcher" target="_blank" rel="noopener noreferrer">
            GitHub <i class="fa-brands fa-github"></i>
          </a>
        </li>
      </ul>
    </nav>
  </div>
</header>

{#if isMenuOpen}
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <div class="mobile-nav-backdrop" onclick={toggleMenu}></div>
{/if}

<style lang="scss">
  header {
    background-color: white;
    display: flex;
    flex-direction: row;
    position: sticky;
    top: 0;
    width: 100%;
    z-index: 1000;
    padding: 16px 0;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.03);
    border-bottom: 1px solid var(--border-color);

    .container-layout {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }

  a.logo {
    font-size: 1.5rem;
    font-weight: bold;
    color: var(--text-dark-color);
    border: none;
    transition: opacity 0.2s;

    span {
      color: var(--primary-color);
    }

    &:hover {
      opacity: 0.8;
    }
  }

  ul {
    list-style: none;
    display: flex;
    gap: 24px;
    padding: 0;
    margin: 0;

    li a {
      text-decoration: none;
      color: var(--text-dark-color);
      font-weight: 500;
      transition: color 0.2s;
      border-bottom: 2px solid transparent;
      transition:
        border-bottom 0.2s,
        color 0.2s;

      &.active,
      &:hover {
        color: var(--primary-color);
        border-bottom: 2px solid var(--primary-color);
      }
    }
  }

  button.mobile-menu-btn {
    display: none;
    background: none;
    border: none;
    cursor: pointer;
    color: var(--text-dark-color);
    padding: 0;
    font-size: 1.2rem;
  }

  @media (max-width: 768px) {
    button.mobile-menu-btn {
      display: block;
    }

    ul.nav-links {
      height: 0;
      position: absolute;
      top: 67px;
      width: 100%;
      left: 0;
      background-color: white;
      flex-direction: column;
      align-items: flex-start;
      gap: 0;
      padding: 0 16px;
      box-shadow: 0 5px 5px rgba(0, 0, 0, 0.1);
      border-radius: 0;
      overflow: hidden;
      display: flex;
      transition:
        height 0.3s ease,
        padding 0.3s ease;

      &.active {
        height: 147px;
        padding: 16px;
      }

      li {
        margin-bottom: 0;
        width: 100%;

        a {
          display: block;
          width: 100%;
          border-bottom: none;
          padding: 12px 0 12px 12px;
          position: relative;
        }

        :hover:not(.active) {
          color: var(--text-dark-color);
        }

        a.active::after {
          content: '';
          display: inline-block;
          position: absolute;
          left: 0;
          top: 12px;
          height: 25px;
          width: 4px;
          background-color: var(--primary-color);
        }
      }
    }
  }

  .mobile-nav-backdrop {
    position: fixed;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.4);
    z-index: 900;
  }
</style>
