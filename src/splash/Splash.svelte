<script lang="ts">
  import { onMount } from "svelte";
  import { AVAILABLE_LOCALES, type Locale } from "$lib/i18n/i18n";
  import { setLocale } from "$lib/rpc/config";
  import { getVersion } from "@tauri-apps/api/app";
  import LanguageSelect from "/src/splash/components/SelectLanguage.svelte";
  import ProgressStepper from "/src/splash/components/ProgressStepper.svelte";
  import { type Step } from "./step";
  import { type } from "@tauri-apps/plugin-os";
  import { _ } from "svelte-i18n";
  import { Button } from "flowbite-svelte";
  import SelectInstallFolder from "/src/splash/components/SelectInstallFolder.svelte";
  import SplashBackground from "/src/splash/components/SplashBackground.svelte";
  import SplashHeader from "/src/splash/components/SplashHeader.svelte";
  import { openMainWindow } from "$lib/rpc/window";
  import SelectLanguage from "/src/splash/components/SelectLanguage.svelte";

  let loaded = false;
  let clientVersion: string;
  let isWindowControlsLeft = false;
  let currentStep = 0;

  onMount(async () => {
    clientVersion = await getVersion();
    isWindowControlsLeft = type() === "macos";
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
      const errorClosing = await openMainWindow();
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

  {#if loaded}
    <div class="splash-content">
      <div class="flex flex-shrink-0 flex-row items-center justify-center">
        <h1 class="text-4xl mt-16">{steps()[currentStep].displayText}</h1>
      </div>
      <div class="flex flex-col flex-grow min-h-0 justify-center items-center p-2">

        <div class="flex flex-col flex-grow min-h-0 pt-8 pb-16 w-full">
          {#if currentStep === 0}
            <LanguageSelect
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
    </div>
  {/if}


  <div>
    <Button class="bg-primary text-primary hover:bg-primary-hover hover:text-primary-hover rounded">
      {$_("setup_button_continue")}
    </Button>
  </div>
</div>

<style lang="postcss">
  @import "./splash.css";

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
