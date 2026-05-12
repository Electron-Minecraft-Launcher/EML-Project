<script lang="ts">
  import SEO from '$lib/components/SEO.svelte'
</script>

<SEO title="EML Docs" description="Documentation for EML Lib, EML AdminTool, and related projects." />

<h1>EML Docs</h1>

<p>
  Welcome to the EML documentation! Here you'll find guides, API references, and other resources to help you get started with EML Lib, EML AdminTool,
  and related projects.
</p>

<p>
  Use the sidebar to navigate through the documentation. If you're new, we recommend starting with the <a href="/docs/introduction/what-is-eml"
    >What is EML?</a
  > page.
</p>

<div class="grid">
  <a href="/docs/introduction/what-is-eml" class="project-card">
    <div class="icon"><i class="fa-solid fa-question-circle"></i></div>
    <div class="content">
      <h2>Introduction</h2>
      <p>Learn about what EML is, its features, and how it can benefit you.</p>
    </div>
    <div class="arrow">
      <i class="fa-solid fa-arrow-right"></i>
    </div>
  </a>
  <a href="/docs/eml-admintool/system-requirements" class="project-card">
    <div class="icon"><i class="fa-solid fa-server"></i></div>
    <div class="content">
      <h2>EML AdminTool</h2>
      <p>Learn about EML AdminTool, how to install it, and its features.</p>
    </div>
    <div class="arrow">
      <i class="fa-solid fa-arrow-right"></i>
    </div>
  </a>
  <a href="/docs/eml-lib-and-launcher/getting-started/set-up-environment" class="project-card">
    <div class="icon"><i class="fa-solid fa-cube"></i></div>
    <div class="content">
      <h2 style="letter-spacing: -0.5px;">EML Lib and Launcher</h2>
      <p>Learn about how to use EML Lib to build a launcher.</p>
    </div>
    <div class="arrow">
      <i class="fa-solid fa-arrow-right"></i>
    </div>
  </a>
</div>

<style lang="scss">
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 30px;
    margin-top: 50px;
    margin-bottom: 50px;
  }

  .project-card {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 30px;
    background: white;
    border: 1px solid var(--border-color);
    border-radius: 10px;
    text-decoration: none;
    color: inherit;
    transition: all 0.2s ease;

    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 20px rgba(0, 0, 0, 0.08);
      border-color: var(--primary-color);
    }
  }

  .icon {
    font-size: 2rem;
    margin-bottom: 20px;
  }

  .content {
    h2 {
      margin: 0 0 10px 0;
      font-size: 1.5rem;
      line-height: 1.5;
    }

    p {
      color: var(--text-muted);
      line-height: 1.5;
      margin: 10px 0 0 0;
      flex-grow: 1;
    }
  }

  .arrow {
    margin-top: 20px;
    align-self: flex-end;
    color: var(--primary-color);
    opacity: 0;
    transition: opacity 0.2s;
  }

  .project-card:hover .arrow {
    opacity: 1;
  }
</style>
