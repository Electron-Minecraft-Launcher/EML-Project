<script lang="ts">
  import { page } from '$app/state'
</script>

<section class="container-layout">
  <h1>{page.status}</h1>
  <p>{page.error?.message}</p>
  <a href="/">Go back to home</a>
</section>

<style lang="scss">
  .container-layout {
    text-align: center;
    padding: 200px 0 150px 0;
  }

  h1 {
    font-size: 6rem;
    margin-bottom: 0;
  }

  p {
    color: var(--text-muted);
    font-size: 1.3rem;
    font-weight: 500;
  }
</style>

