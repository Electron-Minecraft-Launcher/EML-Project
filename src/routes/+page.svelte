<script lang="ts">
  import SEO from '$lib/components/SEO.svelte'
  import hljs from 'highlight.js'
  import typescript from 'highlight.js/lib/languages/typescript'
  // import 'highlight.js/styles/github-dark.css'

  hljs.registerLanguage('typescript', typescript)

  const codeSample = `import { app, BrowserWindow } from 'electron'
import { MicrosoftAuth, Launcher } from 'eml-lib'

app.whenReady().then(start)

async function start() {
  const mainWindow = new BrowserWindow()

  // 1. Authenticate
  const account = await (new MicrosoftAuth(mainWindow)).auth()

  // 2. Setup launcher
  const launcher = new Launcher({
    url: 'https://at.emlproject.pages.dev',
    serverId: 'goldfrite',
    account: account,
    memory: { min: 2048, max: 1024 },
  })
  
  // 3. Launch
  await launcher.launch()
}
`
</script>

<SEO
  title="EML Project — Build your own Minecraft launcher"
  description="An open-source, modular infrastructure designed for server administrators. Create, secure, and distribute your modpacks with professional tools."
/>

<section class="hero">
  <div class="container-layout">
    <h1>Build your own <span>Minecraft launcher</span></h1>
    <p>
      An open-source, modular infrastructure designed for server administrators. Create, secure, and distribute your modpacks with professional tools.
    </p>

    <div class="buttons">
      <a href="/docs" class="button button-primary">Get Started</a>
      <a href="/packages" class="button button-secondary">Browse packages</a>
    </div>
  </div>
</section>

<section class="features container-layout">
  <div class="card">
    <h3><i class="fa-solid fa-cube"></i> EML Lib</h3>
    <p>The core logic handled for you: Microsoft Auth, File Hashing, Java launching, and integrity checks.</p>
  </div>
  <div class="card">
    <h3><i class="fa-solid fa-server"></i> EML AdminTool</h3>
    <p>A self-hosted web dashboard to manage your launcher, news, maintenance and files remotely via a modern interface.</p>
  </div>
  <div class="card">
    <h3><i class="fa-solid fa-layer-group"></i> EML Template</h3>
    <p>A ready-to-use Electron + Vite frontend. Customize the design with HTML/CSS, we handle the backend logic.</p>
  </div>
</section>

<section class="code-preview container-layout">
  <div class="text-content">
    <h2>Developer first</h2>
    <p>
      Don't reinvent the wheel. Our library handles the complex parts of the Minecraft protocol, so you can focus on building a unique experience for
      your players.
    </p>
    <ul class="check-list">
      <li><i class="fa-solid fa-check"></i>Native Microsoft authentication</li>
      <li><i class="fa-solid fa-check"></i>Automatic Java download</li>
      <li><i class="fa-solid fa-check"></i>Vanilla, Forge, NeoForge, Fabric and Quilt support</li>
    </ul>
  </div>

  <div class="code-block">
    <div class="code-header">
      <span class="dot red"></span>
      <span class="dot yellow"></span>
      <span class="dot green"></span>
      <span class="filename">launcher.ts</span>
    </div>
    <pre><code>{@html hljs.highlight(codeSample, { language: 'typescript' }).value}</code></pre>
  </div>
</section>

<section class="roadmap-section container-layout">
  <h2>Project Roadmap</h2>
  <div class="roadmap">
    <div class="step completed">
      <div class="step-number"><i class="fa-solid fa-check"></i></div>
      <div class="step-content">
        <h3>V1 Legacy</h3>
        <p>Proof of concept. Functional but with security flaws. Deprecated.</p>
      </div>
    </div>
    <div class="step active">
      <div class="step-number">2</div>
      <div class="step-content">
        <h3>V2 Beta (current)</h3>
        <p>Complete rewrite. Secure architecture. EML AdminTool with Docker. Forge support.</p>
      </div>
    </div>
    <div class="step">
      <div class="step-number">3</div>
      <div class="step-content">
        <h3>V2 Release</h3>
        <p>NeoForge, Fabric & Quilt support. Public release.</p>
      </div>
    </div>
    <div class="step">
      <div class="step-number">4</div>
      <div class="step-content">
        <h3>New features</h3>
        <p>Multi-instance support. EML AdminTool-agnostic version of EML Lib.</p>
      </div>
    </div>
  </div>
</section>

<section class="cta">
  <div class="container-layout">
    <h2>Ready to build?</h2>
    <p>Join the Discord community or start reading the documentation.</p>
    <div class="buttons">
      <a href="https://discord.gg/YVB4k6HzAY" target="_blank" class="button button-discord">
        <i class="fa-brands fa-discord"></i>&nbsp;&nbsp;Join Discord
      </a>
      <a href="/docs" class="button button-primary">Start installation</a>
    </div>
  </div>
</section>

<style lang="scss">
  @use 'sass:meta';
  @use '../../static/styles/roadmap.scss';

  section.hero {
    text-align: center;

    h1 {
      font-size: 2.8rem;
      margin-bottom: 16px;

      span {
        color: var(--primary-color);
      }
    }

    p {
      max-width: 600px;
      margin: 0 auto 24px;
      font-size: 1.1rem;
      color: var(--text-muted);
    }

    .buttons {
      display: flex;
      justify-content: center;
      gap: 16px;

      a {
        display: block;
        padding: 16px 24px;
        width: 150px;
        border-radius: 50rem;
        border-bottom: none;
        outline: 0px solid var(--primary-tr-color-hover);
        transition: outline 0.1s;
        font-weight: 500;

        &:hover:active {
          outline: 6px solid var(--primary-tr-color-hover);
          transform: translateY(0);
        }
      }

      .button-primary {
        background-color: var(--primary-color);
        color: white;
      }

      .button-secondary {
        background-color: var(--secondary-color);
        color: var(--text-dark-color);
      }
    }
  }

  .features {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 30px;
    padding: 60px 0;

    .card {
      background: white;
      padding: 25px 30px;
      border-radius: 12px;
      border: 1px solid var(--border-color);

      h3 {
        margin: 0 0 15px 0;
        font-size: 1.2rem;
        display: flex;
        align-items: center;
        gap: 10px;
      }

      p {
        font-size: 0.95rem;
        color: var(--text-muted);
        margin: 0;
      }
    }
  }

  .code-preview {
    display: flex;
    align-items: center;
    gap: 50px;
    padding: 80px 0;
    border-top: 1px solid var(--border-color);

    .text-content {
      flex: 1;

      h2 {
        font-size: 2.2rem;
        margin: 0 0 20px 0;
      }

      .check-list {
        list-style: none;
        padding: 0;
        margin-top: 20px;
        li {
          margin-bottom: 10px;
          display: flex;
          align-items: center;
          gap: 10px;
          font-weight: 500;
          i {
            color: var(--primary-color);
          }
        }
      }
    }

    .code-block {
      flex: 1;
      background: #1e1e1e;
      border-radius: 10px;
      padding: 20px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
      color: #d4d4d4;
      font-size: 0.9rem;

      :global {
        @include meta.load-css('static/styles/home-theme.scss');
      }

      .code-header {
        display: flex;
        gap: 8px;
        margin-bottom: 20px;
        align-items: center;
        .dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
        }
        .red {
          background: #ff5f56;
        }
        .yellow {
          background: #ffbd2e;
        }
        .green {
          background: #27c93f;
        }
        .filename {
          margin-left: auto;
          color: #888;
          font-size: 0.8rem;
        }
      }

      pre {
        margin: 0;
        overflow-x: auto;
      }

      code,
      code > span * {
        font-family: 'Fira Code', monospace !important;
      }

      .keyword {
        color: #569cd6;
      }
      .string {
        color: #ce9178;
      }
      .comment {
        color: #6a9955;
      }
    }
  }

  .roadmap-section {
    padding: 80px 0;
    h2 {
      text-align: center;
      margin: 0 0 50px 0;
      font-size: 2.2rem;
    }
  }

  .cta {
    background: white;
    padding: 80px 0;
    text-align: center;
    border-top: 1px solid var(--border-color);
    border-bottom: 1px solid var(--border-color);

    h2 {
      font-size: 2rem;
      margin: 0 0 10px 0;
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

      .button-primary {
        background: var(--primary-color);
        color: white;

        &:hover:active {
          outline: 6px solid var(--primary-tr-color-hover);
        }
      }

      .button-discord {
        background: #5865f2;
        color: white;

        &:hover:active {
          outline: 6px solid rgba(88, 101, 242, 0.3);
        }
      }
    }
  }

  @media (max-width: 768px) {
    .code-preview {
      flex-direction: column;
      .code-block {
        width: 100%;
      }
    }

    section.hero {
      h1 {
        font-size: 2.2rem;
      }
      .buttons {
        flex-direction: column;
        align-items: center;
      }
    }
  }
</style>
