import { invoke_rpc } from "$lib/rpc/rpc";

export async function getActiveVersion(): Promise<string | null> {
  return await invoke_rpc(
    "get_setting_value",
    { key: "active_version" },
    () => null,
  );
}