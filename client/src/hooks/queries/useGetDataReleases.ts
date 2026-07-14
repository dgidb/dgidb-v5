import { useQuery } from 'react-query';

const DATA_RELEASES_URL =
  'https://api.github.com/repos/dgidb/dgidb-data/releases?per_page=100';

export interface GithubReleaseAsset {
  name: string;
  browser_download_url: string;
}

export interface GithubDataRelease {
  tag_name: string;
  name: string | null;
  draft: boolean;
  assets: GithubReleaseAsset[];
}

export async function fetchDataReleases(): Promise<GithubDataRelease[]> {
  const response = await fetch(DATA_RELEASES_URL, {
    headers: { Accept: 'application/vnd.github+json' },
  });

  if (!response.ok) {
    throw new Error('Unable to retrieve DGIdb data releases from GitHub.');
  }

  const releases = (await response.json()) as GithubDataRelease[];
  return releases.filter((release) => !release.draft);
}

export function useGetDataReleases() {
  return useQuery('data_releases', fetchDataReleases, {
    staleTime: 60 * 60 * 1000,
  });
}
