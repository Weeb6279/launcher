<script lang="ts">
  import { osType } from "$lib/tauri-controls/utils/os"
  import { cn } from "$lib/tauri-controls/utils/utils"
  import Gnome from "./controls/linux/Gnome.svelte"
  import Windows from "./controls/Windows.svelte"

  export let platform = "windows"
  export let hide = false
  export let hideMethod = "display"
  export let justify = false

  const customClass = cn(
    "flex",
    $$props.class,
    hide && (hideMethod === "display" ? "hidden" : "invisible")
  )

  // Determine the default platform based on the operating system if platform not specified
  if (!platform) {
    switch (osType) {
      case "macos":
        platform = "macos"
        break
      case "linux":
        platform = "gnome"
        break
      default:
        platform = "windows"
    }
  }
</script>

{#if platform === "windows"}
  <Windows {...$$props} class={cn(customClass, justify && "ml-auto")} />
{:else if platform === "macos"}
  <!-- MacOS uses native window controls. Linux and windows don't have this api -->
{:else if platform === "gnome"}
  <Gnome {...$$props} class={cn(customClass, justify && "ml-auto")} />
{:else}
  <Windows {...$$props} class={cn(customClass, justify && "ml-auto")} />
{/if}