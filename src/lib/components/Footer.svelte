<footer>
  <div class="container-layout">
    <div class="footer-col">
      <h4>EML Project</h4>
      <p style="font-size: 14px; opacity: 0.8;">An open-source, self-hosted infrastructure to build and distribute your custom Minecraft Launcher.</p>
    </div>

    <div class="footer-col">
      <h4>Project</h4>
      <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/docs">Documentation</a></li>
      </ul>
    </div>

    <div class="footer-col">
      <h4>Community</h4>
      <ul>
        <li><a href="https://github.com/Electron-Minecraft-Launcher" target="_blank">GitHub</a></li>
        <li><a href="https://discord.gg/nfEHKtghPh" target="_blank">Discord</a></li>
        <li><a href="https://www.npmjs.com/package/electron-minecraft-launcher" target="_blank">NPM</a></li>
      </ul>
    </div>
  </div>

  <div class="copyright">
    &copy; {new Date().getFullYear()} EML Project. Licensed under MIT and AGPL-3.0.
  </div>
</footer>

<style lang="scss">
  footer {
    background: var(--bg-body);
    border-top: 1px solid var(--border);
    padding: 40px 0 20px;
    margin-top: auto;
    text-align: center;

    .container-layout {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      gap: 30px;
      margin-bottom: 30px;
      padding-top: 30px;
      text-align: left;
      border-top: 1px solid var(--border-color);
    }

    .footer-col {
      flex: 1;
      min-width: 200px;

      h4 {
        margin-bottom: 15px;
        font-size: 16px;
        color: var(--text-main);
      }

      ul {
        list-style: none;
        padding: 0;
        margin: 0;

        li {
          margin-bottom: 8px;
          font-size: 14px;
          color: var(--text-muted);
        }
      }
    }

    .copyright {
      font-size: 13px;
      color: var(--text-muted);
      border-top: 1px solid var(--border);
      padding-top: 0;
      width: 90%;
      margin: 0 auto;
    }
  }
</style>
