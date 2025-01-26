import { locale as svelteLocale } from "svelte-i18n";
import { invoke_rpc } from "./rpc";
import { AVAILABLE_LOCALES } from "$lib/i18n/i18n";
import { exists } from "@tauri-apps/plugin-fs";
import { appDataDir, join } from "@tauri-apps/api/path";
import { convertFileSrc } from "@tauri-apps/api/core";
import { errorLog } from "$lib/rpc/logging";

export async function getInstallationDirectory(): Promise<string | null> {
  return await invoke_rpc(
    "get_setting_value",
    { key: "install_directory" },
    () => null,
  );
}

export async function setInstallationDirectory(
  newDir: string,
): Promise<string | null> {
  // TODO - not insanely crazy about this pattern (message in the response instead of the error)
  // consider changing it
  const errMsg = await invoke_rpc(
    "set_install_directory",
    { newDir: newDir },
    () => "Unexpected error occurred",
    "Invalid installation directory",
  );

  if (errMsg !== null) {
    // for RPC errors the log and toast are done by invoke_rpc
    // but this is a successful RPC, so we need to do it here
    errorLog("Unable to set install directory");
  }

  return errMsg;
}

export async function saveActiveVersionChange(
  newActiveVersion: String,
): Promise<boolean> {
  return invoke_rpc(
    "update_setting_value",
    { key: "active_version", val: newActiveVersion },
    () => false,
    "Couldn't save active version change",
    () => true,
  );
}

export async function getLocale(): Promise<string | null> {
  return await invoke_rpc(
    "get_setting_value",
    { key: "locale" },
    () => "en-US",
  );
}

export async function setLocale(localeId: string): Promise<void> {
  return await invoke_rpc(
    "update_setting_value",
    { key: "locale", val: localeId },
    () => {},
    undefined, // no toast
    async () => {
      svelteLocale.set(localeId);
      // Update CSS variable if needed
      let localeInfo = AVAILABLE_LOCALES.find(
        (locale) => locale.id === localeId,
      );
      if (
        localeInfo !== undefined &&
        localeInfo.fontFamily !== undefined &&
        localeInfo.fontFileName !== undefined
      ) {
        // Dynamically get the font
        const fontPath = await join(
          await appDataDir(),
          "fonts",
          localeInfo.fontFileName,
        );
        const fontExists = await exists(fontPath);
        if (fontExists) {
          const assetUrl = convertFileSrc(fontPath);
          var newFontStyle = document.createElement("style");
          newFontStyle.appendChild(
            document.createTextNode(
              `@font-face {\nfont-family: "${localeInfo.fontFamily}";\nsrc: url('${assetUrl}');\n}\n`,
            ),
          );
          document.head.appendChild(newFontStyle);
          document.documentElement.style.setProperty(
            "--launcher-font-family",
            localeInfo.fontFamily,
          );
        } else {
          document.documentElement.style.setProperty(
            "--launcher-font-family",
            "Noto Sans",
          );
        }
      } else {
        document.documentElement.style.setProperty(
          "--launcher-font-family",
          "Noto Sans",
        );
      }
    },
  );
}

export async function setAutoUpdateGames(value: boolean): Promise<void> {
  return await invoke_rpc(
    "update_setting_value",
    { key: "auto_update_games", val: value },
    () => {},
  );
}

export async function getAutoUpdateGames(): Promise<boolean> {
  return await invoke_rpc(
    "get_setting_value",
    { key: "auto_update_games" },
    () => false,
  );
}