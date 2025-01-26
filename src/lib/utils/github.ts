import { arch, platform } from "@tauri-apps/plugin-os";
import type { GithubRelease } from "$lib/utils/githubRelease";
import { allReleases } from "$lib/utils/allReleases";
import { currentRelease } from "$lib/utils/latestRelease";

export interface ReleaseInfo {
  version: string;
  date?: Date;
  githubLink?: string;
  downloadUrl?: string;
  isDownloaded: boolean;
  pendingAction: boolean;
  invalid: boolean;
  invalidationReasons: string[];
}
function getDownloadLinkForCurrentPlatform(release: GithubRelease) {
  let plat = platform();
  let matchingAsset;
  if (plat == "macos") {
    const userArch = arch() === "aarch64" ? "arm" : "intel";
    matchingAsset = release.assets.find(
      (asset) =>
        asset.name.toLowerCase().includes(plat) &&
        !asset.name.toLowerCase().includes(".bin") &&
        !asset.name.toLowerCase().includes("lsp") &&
        asset.name.toLowerCase().includes(userArch),
    );
  } else {
    matchingAsset = release.assets.find(
      (asset) =>
        asset.name.toLowerCase().includes(plat) &&
        !asset.name.toLowerCase().includes(".bin") &&
        !asset.name.toLowerCase().includes("lsp"),
    );
  }
  if (matchingAsset) {
    return matchingAsset.browser_download_url;
  }
  return undefined;
}
function parseGithubRelease(githubRelease: GithubRelease): ReleaseInfo {
  const releaseInfo: ReleaseInfo = {
    version: githubRelease.tag_name,
    date: new Date(githubRelease.published_at),
    githubLink: githubRelease.html_url,
    downloadUrl: getDownloadLinkForCurrentPlatform(githubRelease),
    isDownloaded: false,
    pendingAction: false,
    invalid: false,
    invalidationReasons: [],
  };
  if (releaseInfo.downloadUrl == null) {
    releaseInfo.invalid = true;
  }

  return releaseInfo;
}

export async function listOfficialReleases(): Promise<ReleaseInfo[]> {
  const nextUrlPattern = /<(\S+)>; rel="Next"/i;
  let releases: ReleaseInfo[] = [];
  let urlToHit: string | undefined =
    "https://api.github.com/repos/open-goal/jak-project/releases?per_page=100";

  while (urlToHit !== undefined) {
    // const resp = await fetch(urlToHit);
    // const githubReleases = await resp.json() as GithubRelease[];

    const githubReleases = allReleases;
    for (const release of githubReleases) {
      releases.push(parseGithubRelease(release));
    }

    urlToHit = undefined;

    // const link = resp.headers.get("link");
    // if (
    //   link != null &&
    //   link.includes(`rel=\"next\"`)
    // ) {
    //   // we must paginate!
    //   const match = link.match(nextUrlPattern);
    //   if (match != null) {
    //     urlToHit = match[1];
    //   }
    // }
  }
  return releases.sort((a, b) => {
    if (b.date == null) {
      return 1;
    }
    if (a.date == null) {
      return -1;
    }
    if (b.date == a.date) {
      return 0;
    }
    return b.date < a.date ? -1 : 1;
  });
}

export async function getLatestOfficialRelease(): Promise<
  ReleaseInfo | undefined
> {
  // const resp = await fetch(
  //   "https://api.github.com/repos/open-goal/jak-project/releases/latest",
  // );
  // const githubRelease = await resp.json() as GithubRelease;

  const githubRelease = currentRelease;
  return parseGithubRelease(githubRelease);
}