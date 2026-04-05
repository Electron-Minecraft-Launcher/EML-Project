<script lang="ts">
  import SEO from '$lib/components/SEO.svelte'

  const tools: { id: string; name: string; description: string; icon: string; link: string; blank?: boolean }[] = [
    {
      id: 'config-generator',
      name: 'Config generator',
      description: 'Generate the config object for EML Lib.',
      icon: 'fa-solid fa-cog',
      link: '/resources/config-generator'
    },
    {
      id: 'modpack-json-generator',
      name: 'Modpack JSON generator',
      description: 'Generate JSON files for your Minecraft modpacks.',
      icon: 'fa-solid fa-file-code',
      link: '/resources/modpack-json-generator'
    },
    {
      id: 'minecraft-versions',
      name: 'Minecraft versions',
      description: 'Browse different versions of Minecraft.',
      icon: 'fa-solid fa-cube',
      link: '/resources/minecraft-versions'
    },
    {
      id: 'loaders-versions',
      name: 'Mod loaders versions',
      description: 'Browse different versions of mod loaders.',
      icon: 'fa-solid fa-cube',
      link: '/resources/loaders-versions'
    }
  ]
</script>

<SEO title="Resources — EML Project" description="Browse the tools and resources available for the EML Project." />

<section class="hero small">
  <div class="container-layout">
    <p class="hero-title"><span>EML</span> Resources</p>
  </div>
</section>

<div class="container-layout">
  <div class="header">
    <h1>Tools and resources</h1>
    <p>Browse the tools and resources available for the EML Project.</p>
  </div>

  <div class="grid">
    {#each tools as project}
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
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
    gap: 30px;
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
