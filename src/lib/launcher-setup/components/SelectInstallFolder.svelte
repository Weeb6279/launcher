<script lang="ts">
  import { Button, Fileupload, Input } from "flowbite-svelte";
  import { folderPrompt } from "$lib/utils/file-dialogs";
  import { _ } from "svelte-i18n";
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher<{setFolder: {folder: string}}>();

  let selectedFolder: string;
  async function openFolder() {
    const folder = await folderPrompt("Install dir");

    if (folder != null) {
      selectedFolder = folder;
      dispatch('setFolder', {
        folder
      });
    }
  }
</script>

<div class="select-none flex flex-col w-2/3 flex-grow self-center">
  <div class="flex-grow"></div>
  <h1>{$_("settings_folders_installationDir_prompt")}</h1>
  <p>This folder is used to store downloads and game assets</p>
  <div class="flex flex-row w-full pt-5">
    <Button
      class="flex-shrink-0 bg-secondary text-secondary hover:bg-secondary-hover hover:text-secondary-hover rounded-r-none"
      on:click={openFolder}
    >
      {$_("splash_button_setInstallFolder")}
    </Button>
    <Input class="rounded-l-none cursor-pointer" value={selectedFolder} readonly on:click={openFolder} />
  </div>
  <div class="flex-grow mt-16"></div>
</div>