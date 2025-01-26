import { writable } from "svelte/store";

export const AppStore = writable({
  isLoading: true,
  isSetupCompleted: false,
  launcher: {
    updateAvailable: false,
    versionNumber: undefined,
    changeLog: [],
    date: undefined,
  },
  selectedTooling: {
    updateAvailable: false,
    versionNumber: undefined,
  },
});