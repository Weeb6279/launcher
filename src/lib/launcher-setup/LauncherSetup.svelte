<script lang="ts">
  import { onMount } from "svelte";
  import { type Locale } from "$lib/i18n/i18n";
  import { setLocale } from "$lib/rpc/config";
  import { getVersion } from "@tauri-apps/api/app";
  import SelectLanguage from "$lib/launcher-setup/components/SelectLanguage.svelte";
  import { type Step } from "./step";
  import { _ } from "svelte-i18n";
  import SelectInstallFolder from "$lib/launcher-setup/components/SelectInstallFolder.svelte";
  import SplashBackground from "$lib/launcher-setup/components/SplashBackground.svelte";
  import SplashHeader from "$lib/launcher-setup/components/SplashHeader.svelte";
  import { getCurrentWindow } from "@tauri-apps/api/window";
  import LauncherVersion from "$lib/components/LauncherVersion.svelte";

  let loaded = false;
  let currentStep = 0;

  onMount(async () => {
    await getCurrentWindow().show();
    loaded = true;
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

  async function progressStep() {
    currentStep++;
    if (isFinalStep()) {
      // TODO: notify app that setup is done
    }
  }

  async function selectLocale(locale: Locale) {
    await setLocale(locale.id);
    await progressStep();
  }

  async function setFolder(folder: string) {
    await progressStep();
  }
</script>

{#if loaded}
  <div class="flex flex-shrink-0 flex-row items-center justify-center">
    <h1 class="text-4xl mt-16">{steps()[currentStep].displayText}</h1>
  </div>
  <div class="main-content-centered">

    <div class="flex flex-col flex-grow min-h-0 pt-8 pb-16 w-full">
      {#if currentStep === 0}
        <SelectLanguage
          on:change={(locale) => selectLocale(locale.detail.locale)}
        />
      {:else if currentStep === 1}
        <SelectInstallFolder on:setFolder={(folder) => setFolder(folder.detail.folder)} />
      {:else}
        <div class="flex-grow"></div>
      {/if}
    </div>

    <LauncherVersion></LauncherVersion>
  </div>
{/if} <!-- TODO: add loading spinner here if load takes too long in future -->


<style lang="postcss">
</style>
