import { open } from "@tauri-apps/plugin-dialog";

export async function folderPrompt(title: string): Promise<string | undefined> {
  const path = await open({
    title: title,
    multiple: false,
    directory: true,
  });

  if (Array.isArray(path) || path === null) {
    return undefined;
  }

  return path;
}