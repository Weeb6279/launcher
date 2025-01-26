<script lang="ts">
  import { onMount } from "svelte";
  import { type Locale } from "$lib/i18n/i18n";
  import { getInstallationDirectory, getLocale, setInstallationDirectory, setLocale } from "$lib/rpc/config";
  import SelectLanguage from "/src/routes/launcher-setup/components/SelectLanguage.svelte";
  import { type Step } from "/src/routes/launcher-setup/types/step";
  import { _, isLoading, locale as svelteLocale } from "svelte-i18n";
  import SelectInstallFolder from "/src/routes/launcher-setup/components/SelectInstallFolder.svelte";
  import { navigate } from "svelte-navigator";
  import { AppStore } from "$lib/stores/AppStore";
  import { getActiveVersion } from "$lib/rpc/versions";
  import { getVersion } from "@tauri-apps/api/app";
  import SelectTooling from "/src/routes/launcher-setup/components/SelectTooling.svelte";

  let currentStep = 0;

  onMount(async () => {
    $AppStore.launcher.activeVersion = await getVersion();
    console.log($AppStore.launcher.activeVersion);

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
      $AppStore.isLoading = false;
      return;
    }
    $AppStore.selectedTooling.activeVersion = activeToolingVersion;
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

  async function setToolingVersion(toolingVersion: string) {
    $AppStore.selectedTooling.activeVersion = toolingVersion;
    progressStep();
  }

</script>

<div class="flex flex-shrink-0 flex-row items-center justify-center">
  <h1 class="text-4xl mt-16">{steps()[currentStep].displayText}</h1>
</div>

<div class="flex flex-col flex-grow min-h-0 pt-8 pb-16 w-full">
  {#if currentStep === 0}
    <SelectLanguage
      on:change={(locale) => selectLocale(locale.detail.locale)}
    />
  {:else if currentStep === 1}
    <SelectInstallFolder on:setFolder={(folder) => setFolder(folder.detail.folder)} />

  {:else if currentStep === 2}
    <SelectTooling on:setToolingVersion={(tooling) => setToolingVersion(tooling.detail.toolingVersion)} />
  {:else}
    <div class="flex-grow"></div>
  {/if}
</div>

<style lang="postcss">
</style>
