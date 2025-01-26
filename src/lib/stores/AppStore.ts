import { writable } from "svelte/store";

type LauncherSchema = {
  updateAvailable: boolean;
  /**
   * The version of the latest version on github
   */
  versionNumber?: string;
  /**
   * The version currently installed
   */
  activeVersion?: string;
  changeLog: string[];
  date?: Date;
  installationDirectory?: string;
};

type ToolingSchema = {
  updateAvailable: boolean;
  /**
   * The version of the latest version on github
   */
  versionNumber?: string;
  /**
   * The version currently installed
   */
  activeVersion?: string;
  autoUpdate: boolean;
};

type Schema = {
  isLoading: boolean;
  isSetupCompleted: boolean;
  launcher: LauncherSchema;
  selectedTooling: ToolingSchema;
};

export const AppStore = writable<Schema>({
  isLoading: true,
  isSetupCompleted: false,
  launcher: {
    updateAvailable: false,
    changeLog: [],
  },
  selectedTooling: {
    updateAvailable: false,
    autoUpdate: true
  },
});
