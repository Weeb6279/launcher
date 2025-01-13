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

  let loaded = false;
  let clientVersion: string;
  let currentStep = 0;

  onMount(async () => {
    clientVersion = await getVersion();
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

<SplashHeader />

<div class="splash-container">
  <!-- Background With two images -->
  <SplashBackground />

  <div class="splash-content">
    {#if loaded}
      <div class="flex flex-shrink-0 flex-row items-center justify-center">
        <h1 class="text-4xl mt-16">{steps()[currentStep].displayText}</h1>
      </div>
      <div class="flex flex-col flex-grow min-h-0 justify-center items-center p-2">

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

        <div class="self-start text-background font-default-shadow">
          {$_("header_launcherVersionLabel")} v{clientVersion}
        </div>
      </div>
    {/if} <!-- TODO: add loading spinner here if load takes too long in future -->
  </div>
</div>

<style lang="postcss">
  .splash-container {
    @apply relative flex-grow text-background;
  }

  .splash-content {
    @apply absolute inset-0 z-20 flex flex-col;
  }


  .splash-content__centered {
    @apply flex flex-col flex-grow justify-center items-center;
    @apply flex-grow p-2 gap-5;
  }
</style>
