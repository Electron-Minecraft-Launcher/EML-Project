<script lang="ts">
  import SEO from '$lib/components/SEO.svelte'

  const roadmapItems = [
    {
      id: 1,
      target: 'lib',
      version: 'v1.0.0',
      title: 'Legacy concept',
      description: 'Proof of concept. Functional but with security flaws. Deprecated.',
      status: 'completed'
    },
    {
      id: 1,
      target: 'admintool',
      version: 'v1.0.0',
      title: 'Legacy concept',
      description: 'Proof of concept. Functional but with security flaws. Deprecated.',
      status: 'completed'
    },
    {
      id: 2,
      target: 'lib',
      version: 'v2.0.0-beta',
      title: 'Vanilla and Forge support',
      description: 'Complete rewrite of the core library with a secure architecture. Initial support for Vanilla and Forge modded launchers.',
      status: 'completed'
    },
    {
      id: 3,
      target: 'lib',
      version: 'v2.0.0',
      title: 'Full modded support',
      description:
        'Add support for NeoForge, Fabric and Quilt. Implement mod management features like installation, updates and conflict resolution.',
      status: 'active'
    },
    {
      id: 3,
      target: 'admintool',
      version: 'v2.0.0',
      title: 'Complete rewrite',
      description: 'Rebuild the AdminTool with a modern UI and improved user experience.',
      status: 'completed'
    },
    {
      id: 4,
      target: 'admintool',
      version: 'v2.1.0',
      title: 'Improved uploading system',
      description: 'Redesign the uploading system with chunked uploads.',
      status: 'active'
    },
    {
      id: 5,
      target: 'admintool',
      version: 'v2.2.0',
      title: 'Homepage component',
      description: 'Add a homepage component to display server status and information.',
      status: 'future'
    },
    {
      id: 6,
      target: 'lib',
      version: 'v2.0.1',
      title: 'Replace adm-zip with yauzl',
      description: 'Replace the adm-zip dependency with yauzl for better performance and maintainability.',
      status: 'future'
    },
    {
      id: 7,
      target: 'lib',
      version: 'v2.1.0',
      title: 'Multiple profile support',
      description: 'Allow managing multiple profiles with different configurations and mods.',
      status: 'future'
    },
    {
      id: 7,
      target: 'admintool',
      version: 'v2.3.0',
      title: 'Multiple profile support',
      description: 'Allow managing multiple profiles with different configurations and mods.',
      status: 'future'
    },
    {
      id: 8,
      target: 'lib',
      version: 'v2.2.0',
      title: 'EML AdminTool-agnostic version',
      description: 'Make the library fully independent from the EML AdminTool and usable in any type of application.',
      status: 'future'
    },
    {
      id: 9,
      target: 'lib',
      version: 'v2.3.0',
      title: 'Stats and Crash Reporting features',
      description: 'Add a stats feature to collect anonymous usage data and help prioritize development.',
      status: 'future'
    },
    {
      id: 9,
      target: 'admintool',
      version: 'v2.4.0',
      title: 'Stats and Crash Reporting features',
      description: 'Add a stats feature to collect anonymous usage data and help prioritize development.',
      status: 'future'
    },
    {
      id: 10,
      target: 'lib',
      version: 'v2.4.0',
      title: 'Bypass maintenance mode',
      description: 'Add a feature to allow some specified users to bypass maintenance mode and access the launcher while it is in maintenance.',
      status: 'future'
    },
    {
      id: 10,
      target: 'admintool',
      version: 'v2.5.0',
      title: 'Bypass maintenance mode',
      description: 'Add a feature to allow some specified users to bypass maintenance mode and access the launcher while it is in maintenance.',
      status: 'future'
    },
    {
      id: 11,
      title: 'MCP support',
      target: 'lib',
      version: 'v2.5.0',
      description: 'Add support for Minecraft Coder Pack (MCP) launchers.',
      status: 'future'
    },
    {
      id: 11,
      title: 'MCP support',
      target: 'admintool',
      version: 'v2.6.0',
      description: 'Add support for Minecraft Coder Pack (MCP) launchers.',
      status: 'future'
    },
    {
      id: 12,
      title: 'Multiple instance support',
      target: 'lib',
      version: 'vX.Y.Z',
      description: 'Run multiple launcher projects with the same EML AdminTool instance.',
      status: 'future'
    },
    {
      id: 12,
      title: 'Multiple instance support',
      target: 'admintool',
      version: 'vX.Y.Z',
      description: 'Run multiple launcher projects with the same EML AdminTool instance.',
      status: 'future'
    }
  ]

  const groupedSteps = Object.values(
    roadmapItems.reduce(
      (acc, item) => {
        if (!acc[item.id]) {
          acc[item.id] = { id: item.id, lib: null, admintool: null, status: item.status }
        }
        acc[item.id][item.target] = item
        if (item.status === 'active') acc[item.id].status = 'active'
        return acc
      },
      {} as Record<number, any>
    )
  ).sort((a, b) => a.id - b.id)
</script>

<SEO title="Roadmap — EML Project" description="View the future plans and development timeline for the Electron Minecraft Launcher project." />

<section class="hero small">
  <div class="container-layout">
    <p class="hero-title"><span>EML</span> Roadmap</p>
  </div>
</section>

<section class="roadmap-section container-layout">
  <div class="roadmap">
    {#each groupedSteps as step}
      <div class="step {step.status}">
        <div class="step-number">{step.id}</div>

        <div
          class="cards-container"
          class:lib={step.lib && !step.admintool}
          class:admintool={step.admintool && !step.lib}
          class:both={step.lib && step.admintool}
        >
          {#if step.lib}
            <div class="step-content lib">
              <div class="badge-container">
                <span class="badge lib">EML Lib</span>
                <span class="version">{step.lib.version}</span>
              </div>
              <h3>{step.lib.title}</h3>
              <p>{step.lib.description}</p>
            </div>
          {/if}

          {#if step.admintool}
            <div class="step-content admintool">
              <div class="badge-container">
                <span class="badge admintool">EML AdminTool</span>
                <span class="version">{step.admintool.version}</span>
              </div>
              <h3>{step.admintool.title}</h3>
              <p>{step.admintool.description}</p>
            </div>
          {/if}
        </div>
      </div>
    {/each}
  </div>

  <div class="buttons">
    <a href="https://discord.gg/VbR86WchH9" target="_blank" rel="noreferrer" class="button discord">Discuss on Discord</a>
    <a href="https://github.com/Electron-Minecraft-Launcher" target="_blank" rel="noreferrer" class="button primary github">Discuss on GitHub</a>
  </div>
</section>

<style lang="scss">
  .roadmap-section.container-layout {
    margin-top: 50px;
    
    h2 {
      text-align: center;
      margin: 0 0 50px 0;
      font-size: 2.2rem;
    }

    .buttons {
      margin-top: 30px;
      display: flex;
      justify-content: center;
      gap: 20px;

      .button {
        padding: 12px 24px;
        border-radius: 5px;
        text-decoration: none;
        font-weight: 500;
        outline: 0px solid var(--primary-tr-color-hover);
      }

      .github {
        background: var(--primary-color);
        color: white;
        margin-top: 0;
        width: 150px;
      }

      .discord {
        background: #5865f2;
        color: white;
        width: 150px;

        &:hover:active {
          outline: 6px solid rgba(88, 101, 242, 0.3);
        }
      }
    }
  }

  .roadmap {
    position: relative;
    width: 100%;
    margin: 30px auto 0 auto;
    padding-bottom: 20px;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 4px;
      height: 100%;
      background: linear-gradient(to bottom, var(--primary-color) 0%, var(--primary-color) 27%, var(--border-color) 27%);
      border-radius: 2px;
      z-index: 0;
    }

    .step {
      position: relative;
      display: flex;
      width: 100%;
      margin-bottom: 30px;

      &:last-child {
        margin-bottom: 0;
      }

      .step-number {
        position: absolute;
        left: 50%;
        top: 0;
        transform: translateX(-50%);
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: white;
        border: 2px solid var(--border-color);
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--text-muted);
        font-weight: 700;
        font-size: 1.1rem;
        z-index: 1;
      }

      .cards-container {
        display: flex;
        width: 100%;
        justify-content: space-between;

        &.lib {
          justify-content: flex-start;
        }

        &.admintool {
          justify-content: flex-end;
        }
      }

      .step-content {
        background: white;
        border: 1px solid var(--border);
        border-radius: 10px;
        padding: 20px 25px;
        width: calc(50% - 90px);
        position: relative;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);

        .badge-container {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 3px;

          .badge {
            font-size: 0.75rem;
            font-weight: 600;
            padding: 3px 8px;
            border-radius: 4px;
            text-transform: uppercase;

            &.lib {
              background: #3b82f6;
              color: white;
            }

            &.admintool {
              background: #f97316;
              color: white;
            }
          }

          .version {
            font-size: 0.85rem;
            color: var(--text-muted);
            font-weight: 600;
          }
        }

        h3 {
          margin: 0 0 6px 0;
          color: black;
          font-size: 1.1rem;
        }

        p {
          margin: 0;
          font-size: 0.9rem;
          color: var(--text-main);
          line-height: 1.6;
        }
      }

      &.lib {
        justify-content: flex-start;
      }

      &.admintool {
        justify-content: flex-end;
      }

      &.completed,
      &.active {
        .step-number {
          border-color: var(--primary-color);
          color: var(--primary-color);
        }
        .step-content {
          border-color: var(--primary-color);
        }
      }

      &.active .step-content {
        border-color: var(--primary-color);
      }
    }
  }

  @media (max-width: 768px) {
    .roadmap {
      &::before {
        left: 25px;
        transform: none;
      }

      .step {
        flex-direction: column;
        justify-content: flex-start !important;

        .step-number {
          left: 0;
          transform: none;
        }

        .step-content {
          width: calc(100% - 70px);
          margin-left: 70px;
        }
      }
    }
  }
</style>
