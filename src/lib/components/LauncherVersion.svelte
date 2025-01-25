<script lang="ts">
  import { _ } from "svelte-i18n";
  import { onMount } from "svelte";
  import { getVersion } from "@tauri-apps/api/app";

  let clientVersion: string;
  onMount(async () => {
    clientVersion = await getVersion();
  });
</script>

{#if clientVersion != null}
  <div class="self-start text-background font-default-shadow">
    {$_("header_launcherVersionLabel")} v{clientVersion}
  </div>
{/if}