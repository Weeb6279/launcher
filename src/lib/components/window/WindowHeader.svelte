<script lang="ts">
  import textLogo from "$assets/images/text-logo.webp";
  import WindowControls from "$lib/components/window/tauri-controls/WindowControls.svelte";
  import { type } from "@tauri-apps/plugin-os";


  const os = type();
</script>

<div class="header" data-tauri-drag-region>
  {#if os === "macos"}
    <WindowControls platform="macos" />
  {/if}
  <div class="flex-grow pointer-events-none"></div>
  <div class="h-12 p-2 pointer-events-none">
    <img class="h-full self-center not-draggable" src={textLogo} />
  </div>
  <div class="flex-grow pointer-events-none"></div>
  {#if os !== "macos"}
    <div class="pointer-events-none">
      <WindowControls platform={os} class="pointer-events-auto" />
    </div>
  {/if}
</div>

<style lang="postcss">
  .header {
    @apply flex flex-row select-none bg-background text-background;
  }
</style>