<script lang="ts">
  import LauncherSetup from "$lib/launcher-setup/LauncherSetup.svelte";
  import SplashHeader from "$lib/launcher-setup/components/SplashHeader.svelte";
  import SplashBackground from "$lib/launcher-setup/components/SplashBackground.svelte";
  import LoadingSpinner from "$lib/components/LoadingSpinner.svelte";

  let requiresSetup = false;
  let isLoading = true;
</script>

<SplashHeader />

<div class="splash-container">
  <!-- Background With two images -->
  <SplashBackground />

  <div class="splash-content">
    {#if requiresSetup}
      <LauncherSetup></LauncherSetup>
    {:else}
      {#if isLoading}
        <div class="main-content-centered mb-12">
          <LoadingSpinner></LoadingSpinner>
        </div>
      {/if}
    {/if}
  </div>
</div>


<style lang="postcss">
  .splash-container {
    @apply relative flex-grow text-background;
  }

  .splash-content {
    @apply absolute inset-0 z-20 flex flex-col;
  }
</style>