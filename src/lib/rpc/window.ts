import { invoke_rpc } from "$lib/rpc/rpc";

export async function openMainWindow(): Promise<boolean> {
  return await invoke_rpc("open_main_window", {}, () => false);
}