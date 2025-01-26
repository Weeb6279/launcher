<script lang="ts">
  import { _ } from "svelte-i18n";
  import { AppStore } from "$lib/stores/AppStore";

</script>

<div class="self-start text-background font-default-shadow flex flex-col">
  {#if $AppStore.launcher.activeVersion != null}
    <span>
      {$_("header_launcherVersionLabel")} v{$AppStore.launcher.activeVersion}
    </span>
  {/if}
  {#if $AppStore.selectedTooling.activeVersion != null}
    <div>
      <span>
        {$_("header_toolingVersionLabel")} {$AppStore.selectedTooling.activeVersion}
      </span>
      {#if $AppStore.selectedTooling.updateAvailable && $AppStore.isSetupCompleted}
        <span class="text-secondary text-sm">Update Available</span>
      {/if}
    </div>
  {/if}
</div>
