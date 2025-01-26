import { invoke_rpc } from "$lib/rpc/rpc";

export async function downloadOfficialVersion(
  version: String,
  url: String,
): Promise<boolean> {
  return await invoke_rpc(
    "download_version",
    { version, url, versionFolder: "official" },
    () => false,
    "Unable to download official version",
    () => true,
  );
}

export async function getActiveVersion(): Promise<string | null> {
  return await invoke_rpc(
    "get_setting_value",
    { key: "active_version" },
    () => null,
  );
}