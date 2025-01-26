<script lang="ts">

  import { createEventDispatcher, onMount } from "svelte";
  import { _ } from "svelte-i18n";
  import { getLatestOfficialRelease, listOfficialReleases, type ReleaseInfo } from "$lib/utils/github";
  import {
    Button,
    Toggle
  } from "flowbite-svelte";
  import IconGitHub from "~icons/mdi/github";
  import type { SelectToolingVersionData } from "/src/routes/launcher-setup/types/selectToolingVersion";

  let latestToolingVersion: ReleaseInfo;
  let officialVersionList: ReleaseInfo[] = [];
  let useLatestVersion = true;
  let autoUpdateClient = true;

  const dispatch = createEventDispatcher<{
    setToolingVersion: SelectToolingVersionData
  }>();

  onMount(async () => {
    latestToolingVersion = (await getLatestOfficialRelease())!;
    officialVersionList = await listOfficialReleases();
  });


  $: hideManualUpdate = () => {
    if (useLatestVersion) {
      return "";
    }
    return "disabled";
  };
  $: hideAutoUpdate = () => {
    if (useLatestVersion) {
      return "invisible";
    }
    return "";
  };

  function getButtonClasses(release: ReleaseInfo) {
    if (release.invalid) {
      return "";
    }
    return "default-button py-1.5";
  }

  function getButtonText(release: ReleaseInfo) {
    if (release.invalid) {
      return $_("settings_versions_incompatibleVersion");
    }
    return "Select";
  }

  function setActiveVersion(item: ReleaseInfo) {
    if (item.invalid) {
      console.log("TODO: make toast or something for invalid version");
      return;
    }
    dispatch('setToolingVersion', {
      toolingVersion: item,
      autoUpdate: useLatestVersion && autoUpdateClient
    })
  }

</script>

<div class="flex flex-col flex-grow items-left min-h-0 gap-5 mx-36">
  <div class="flex flex-col gap-3 flex-shrink-0">
    <Toggle bind:checked={useLatestVersion} class="!text-background">Use Latest Version
      ({latestToolingVersion?.version})
    </Toggle>
    <Toggle bind:checked={autoUpdateClient} disabled={useLatestVersion === false}>Auto Update Tooling</Toggle>
  </div>

  {#if !useLatestVersion}
    <div
      class="grid grid-cols-[max-content_minmax(50px,_1fr)_minmax(50px,_1fr)_max-content] flex-grow min-h-0 overflow-hidden overflow-y-auto bg-table">

      {#each officialVersionList as item}
        <span class="p-3 flex justify-center shrink-0 border-b border-b-table">
            <Button class={getButtonClasses(item)} on:click={() => setActiveVersion(item)}>
              {getButtonText(item)}
            </Button>
          </span>
        <span class="p-3 flex items-center justify-center border-b border-b-table">
            {item.date?.toLocaleDateString()}
          </span>
        <span class="p-3 flex items-center justify-center border-b border-b-table">
            {item.version}
          </span>
        <span class="py-3 px-12 flex items-center justify-center border-b border-b-table text-2xl">
            <a href={item.githubLink}>
              <IconGitHub></IconGitHub>
            </a>
          </span>
      {/each}
    </div>
  {:else }
    <div>
      <Button class="default-button" on:click={() => setActiveVersion(latestToolingVersion)}>
        Confirm
      </Button>
    </div>
  {/if}
</div>