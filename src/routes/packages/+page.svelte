<script>
  import SEO from "$lib/components/SEO.svelte"

  const projects = [
    {
      id: 'lib',
      name: 'EML Lib',
      description: 'The core library for your Minecraft launcher. Browse packages via NPM.',
      icon: 'fa-solid fa-cube',
      link: '/packages/lib'
    },
    {
      id: 'admintool',
      name: 'EML AdminTool',
      description: 'The self-hosted backend to manage your launcher. Browse packages via GHRC.',
      icon: 'fa-solid fa-server',
      link: '/packages/admintool'
    },
    {
      id: 'template',
      name: 'EML Template',
      description: 'A starter Minecraft launcher template using EML Lib. Fork it on GitHub.',
      icon: 'fa-solid fa-layer-group',
      blank: true,
      link: 'https://github.com/Electron-Minecraft-Launcher/EML-Template'
    }
  ]
</script>

<SEO title="EML packages — EML Project" description="Browse and discover the various packages that make up the EML Project." />

<section class="hero small">
  <div class="container-layout">
    <p class="hero-title"><span>EML</span> packages</p>
  </div>
</section>

<div class="container-layout">
  <div class="header">
    <h1>Ecosystem</h1>
    <p>Discover the tools and libraries that power the EML Project.</p>
  </div>

  <div class="grid">
    {#each projects as project}
      <a href={project.link} class="project-card" target={project.blank ? '_blank' : undefined}>
        <div class="icon"><i class={project.icon}></i></div>
        <div class="content">
          <h2>{project.name}</h2>
          <p>{project.description}</p>
        </div>
        <div class="arrow">
          <i class="fa-solid fa-arrow-right"></i>
        </div>
      </a>
    {/each}
  </div>
</div>

<style lang="scss">
  .header {
    text-align: center;
    margin-bottom: 3rem;

    h1 {
      font-size: 2.5rem;
      margin-bottom: 10px;
      margin-top: 50px;
    }

    p {
      color: var(--text-muted);
      font-size: 1.2rem;
      margin-top: 0;
    }
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 30px;
  }

  .project-card {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 30px;
    background: white;
    border: 1px solid var(--border-color);
    border-radius: 12px;
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
    font-size: 2.5rem;
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
