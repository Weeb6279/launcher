<script lang="ts">
  import { AVAILABLE_LOCALES, type Locale } from "$lib/i18n/i18n";
  import { Button } from "flowbite-svelte";
  import { _ } from "svelte-i18n";
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher<{ change: { locale: Locale } }>();

  function selectLocale(locale: Locale) {
    dispatch("change", {
      locale
    });
  }

</script>

<div class="flex-grow flex flex-col items-center overflow-y-scroll mx-auto">
  <div class="grid grid-cols-3 gap-3 flex-shrink-0 pr-5 min-h-0">
    {#each AVAILABLE_LOCALES as locale}
      <Button
        class="default-button"
        on:click={() => selectLocale(locale)}>
        <span class="grow-0">{locale.flag}</span>
        <span>{locale.localizedName}</span>
      </Button>
    {/each}
  </div>
</div>