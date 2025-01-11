<script lang="ts">
  import { _ } from "svelte-i18n";
  import type { Step } from "../step";

  const startingOffset = 12.5;
  export let steps: Step[];
  export let currentStep: number;

  $: isFirstStep = (index: number) => {
    return index === 0;
  };

  $: isFinalStep = (index: number) => {
    return index === steps.length - 1;
  };

  $: progressBarProgress = () => {
    return (startingOffset + ((100 - startingOffset) / (steps.length - 1)) * currentStep);
  }

</script>

<div class="w-full px-48 select-none cursor-default">
  <h4 class="sr-only">Status</h4>
  <h1 class="!text-4xl font-medium text-background font-default-shadow">Setup OpenGOAL</h1>
  <div class="mt-6" aria-hidden="true">
    <div class="overflow-hidden rounded-full bg-background">
      <div class="h-3 rounded-full bg-primary" style:width={progressBarProgress() + "%"}></div>
    </div>
    <div
      class="mt-6 grid-cols-3 hidden text-lg font-medium text-gray-600 sm:grid"
    >
      {#each steps as step, index}
        <div 
          class="font-default-shadow h-2l line-clamp-2 text-background"
          class:text-center={!isFirstStep(index)}
          class:text-end={isFinalStep(index)}
          class:text-secondary={currentStep >= index}
        >
          {step.displayText}
        </div>
      {/each}
    </div>
  </div>
</div>

<style lang="postcss">
</style>
