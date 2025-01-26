import type { ReleaseInfo } from "$lib/utils/github";

export type SelectToolingVersionData = {
  toolingVersion: ReleaseInfo,
  autoUpdate: boolean
}