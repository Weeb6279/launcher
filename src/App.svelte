<script lang="ts">
  import WindowHeader from "/src/lib/components/window/WindowHeader.svelte";
  import WindowBackground from "/src/lib/components/window/WindowBackground.svelte";
  import LoadingSpinner from "$lib/components/LoadingSpinner.svelte";
  import LauncherSetup from "/src/routes/launcher-setup/LauncherSetup.svelte";
  import { navigate, Route, Router } from "svelte-navigator";
  import { onMount } from "svelte";
  import { AppStore } from "$lib/stores/AppStore";
  import LauncherVersion from "$lib/components/LauncherVersion.svelte";
  import GameSelection from "/src/routes/game-selection/GameSelection.svelte";

  onMount(async () => {
    console.log("navigate to launcher setup");
    navigate("/launcher-setup");
  });

</script>

<WindowHeader />

<Router>
  <div class="splash-container">
    <!-- Background With two images -->
    <WindowBackground />

    <div class="splash-content">
      {#if $AppStore.isLoading}
        <div class="main-content-centered mb-12">
          <LoadingSpinner></LoadingSpinner>
        </div>
      {/if}

      <div class="main-content-centered" class:!hidden={$AppStore.isLoading}>
        <Route path="/launcher-setup">
          <LauncherSetup></LauncherSetup>
        </Route>
        {#if $AppStore.isSetupCompleted}
          <Route path="/game-selection">
            <GameSelection></GameSelection>
          </Route>
          <LauncherVersion></LauncherVersion>
        {/if}
      </div>
    </div>
  </div>
</Router>

<style lang="postcss">
  .splash-container {
    @apply relative flex-grow text-background;
  }

  .splash-content {
    @apply absolute inset-0 z-20 flex flex-col;
  }
</style>