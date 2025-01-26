<script lang="ts">

  import { onMount } from "svelte";
  import { _ } from "svelte-i18n";
  import { getLatestOfficialRelease, listOfficialReleases, type ReleaseInfo } from "$lib/utils/github";
  import {
    Button,
    Toggle
  } from "flowbite-svelte";
  import IconGitHub from "~icons/mdi/github";
  import { AppStore } from "$lib/stores/AppStore";

  let latestToolingVersion: ReleaseInfo | undefined;
  let officialVersionList: ReleaseInfo[] = [];
  let useLatestVersion = true;
  let autoUpdateClient = true;
  onMount(async () => {
    latestToolingVersion = await getLatestOfficialRelease();
    officialVersionList = await listOfficialReleases();
  });

  $: hideManualUpdate = () => {
    if (useLatestVersion) {
      return "";
    }
    return "invisible";
  };
  $: hideAutoUpdate = () => {
    if (useLatestVersion) {
      return "invisible";
    }
    return "";
  };

  function recalculate() {
    if (useLatestVersion && autoUpdateClient) {
      $AppStore.selectedTooling.autoUpdate = true;
      return;
    }
    $AppStore.selectedTooling.autoUpdate = false;
  }

  function getButtonClasses(release: ReleaseInfo) {
    if (release.invalid) {
      return "";
    }
    return "default-button";
  }

  function getButtonText(release: ReleaseInfo) {
    if (release.invalid) {
      return $_("settings_versions_incompatibleVersion");
    }
    return "Select";
  }

</script>

<div class="flex flex-col flex-grow items-left min-h-0 gap-5 mx-36">
  <div class="flex flex-col gap-3 flex-shrink-0">
    <Toggle bind:checked={useLatestVersion} class="!text-background" on:change={recalculate}>Use Latest Version
      ({latestToolingVersion?.version})
    </Toggle>
    {#if useLatestVersion}
      <Toggle bind:checked={autoUpdateClient}>Auto Update Tooling</Toggle>
    {/if}
  </div>

  {#if !useLatestVersion}
    <div
      class="grid grid-cols-[max-content_minmax(50px,_1fr)_minmax(50px,_1fr)_minmax(50px,_1fr)] flex-grow min-h-0 overflow-hidden overflow-y-auto bg-table">

      {#each officialVersionList as item}
        <span class="p-3 flex justify-center shrink-0 border-b border-b-table">
            <Button class={getButtonClasses(item)}>
              {getButtonText(item)}
            </Button>
          </span>
        <span class="p-3 flex items-center justify-center border-b border-b-table">
            {item.date?.toLocaleDateString()}
          </span>
        <span class="p-3 flex items-center justify-center border-b border-b-table">
            {item.version}
          </span>
        <span class="p-3 flex items-center justify-center border-b border-b-table">
            <a href={item.githubLink}>
              <IconGitHub></IconGitHub>
            </a>
          </span>
      {/each}
    </div>
  {:else }
    <div>
      <Button class="default-button">
        Confirm
      </Button>
    </div>
  {/if}
</div>