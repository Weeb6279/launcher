<script lang="ts">
  import { onMount } from "svelte";
  import { type Locale } from "$lib/i18n/i18n";
  import {
    getAutoUpdateGames,
    getInstallationDirectory,
    getLocale,
    saveActiveVersionChange,
    setAutoUpdateGames,
    setInstallationDirectory,
    setLocale
  } from "$lib/rpc/config";
  import SelectLanguage from "/src/routes/launcher-setup/components/SelectLanguage.svelte";
  import { type Step } from "/src/routes/launcher-setup/types/step";
  import { _, isLoading, locale as svelteLocale } from "svelte-i18n";
  import SelectInstallFolder from "/src/routes/launcher-setup/components/SelectInstallFolder.svelte";
  import { navigate } from "svelte-navigator";
  import { AppStore } from "$lib/stores/AppStore";
  import { getActiveVersion } from "$lib/rpc/versions";
  import { getVersion } from "@tauri-apps/api/app";
  import SelectTooling from "/src/routes/launcher-setup/components/SelectTooling.svelte";
  import type { SelectToolingVersionData } from "/src/routes/launcher-setup/types/selectToolingVersion";
  import { downloadOfficialVersion } from "$lib/rpc/versions.js";
  import { getLatestOfficialRelease } from "$lib/utils/github";
  import semver from "semver/preload";

  let currentStep = 0;

  onMount(async () => {
    $AppStore.launcher.activeVersion = await getVersion();

    const locale = await getLocale();
    if (locale == null) {
      $AppStore.isLoading = false;
      return;
    }
    await setLocale(locale);
    progressStep();

    const installDirectory = await getInstallationDirectory();
    if (installDirectory == null) {
      $AppStore.launcher.installationDirectory = undefined;
      $AppStore.isLoading = false;
      return;
    }
    progressStep();

    const activeToolingVersion = await getActiveVersion();
    console.log(activeToolingVersion);
    if (activeToolingVersion == null) {
      $AppStore.selectedTooling.activeVersion = undefined;
      $AppStore.selectedTooling.autoUpdate = true;
      $AppStore.isLoading = false;
      return;
    }
    $AppStore.selectedTooling.activeVersion = activeToolingVersion;
    $AppStore.selectedTooling.autoUpdate = await getAutoUpdateGames();

    const latestVersion = await getLatestOfficialRelease();
    if (latestVersion != null) {
      $AppStore.selectedTooling.versionNumber = latestVersion.version;
      $AppStore.selectedTooling.updateAvailable = semver.gt(latestVersion.version, activeToolingVersion);
    }

    progressStep();

  });

  $: steps = () => {
    return [
      {
        displayText: $_("splash_selectLocale")
      },
      {
        displayText: $_("splash_button_setInstallFolder")
      },
      {
        displayText: $_("settings_versions_header")
      },
      {
        displayText: $_("setup_done")
      }
    ] satisfies Step[];
  };

  $: isFirstStep = () => {
    return currentStep === 0;
  };

  $: isFinalStep = () => {
    return currentStep === steps().length - 1;
  };

  function progressStep() {
    currentStep++;
    if (isFinalStep()) {
      $AppStore.isLoading = false;
      $AppStore.isSetupCompleted = true;
      navigate("/game-selection");
    }
  }

  async function selectLocale(locale: Locale) {
    await setLocale(locale.id);
    progressStep();
  }

  async function setFolder(folder: string) {
    await setInstallationDirectory(folder);
    progressStep();
  }

  async function setToolingVersion(toolingVersion: SelectToolingVersionData) {
    if (toolingVersion.toolingVersion.downloadUrl == null) {
      console.log("TODO: make toast notification or something. This should not happen ever");
      return;
    }

    $AppStore.isLoading = true;

    // download first so the select tooling version page pops up after crash/user exit
    await downloadOfficialVersion(toolingVersion.toolingVersion.version, toolingVersion.toolingVersion.downloadUrl);
    await saveActiveVersionChange(toolingVersion.toolingVersion.version);
    await setAutoUpdateGames(toolingVersion.autoUpdate);

    $AppStore.isLoading = true;

    $AppStore.selectedTooling.activeVersion = toolingVersion.toolingVersion.version;
    $AppStore.selectedTooling.autoUpdate = toolingVersion.autoUpdate;
    progressStep();
  }

</script>

<div class="flex flex-shrink-0 flex-row items-center justify-center">
  <h1 class="text-4xl mt-16">{steps()[currentStep].displayText}</h1>
</div>

<div class="flex flex-col flex-grow min-h-0 pt-8 pb-16 w-full">
  {#if currentStep === 0 && !$AppStore.isLoading}
    <SelectLanguage
      on:change={(locale) => selectLocale(locale.detail.locale)}
    />
  {:else if currentStep === 1}
    <SelectInstallFolder on:setFolder={(folder) => setFolder(folder.detail.folder)} />

  {:else if currentStep === 2}
    <SelectTooling on:setToolingVersion={(tooling) => setToolingVersion(tooling.detail)} />
  {:else}
    <div class="flex-grow"></div>
  {/if}
</div>

<style lang="postcss">
</style>
