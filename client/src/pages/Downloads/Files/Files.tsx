// dependencies
import React from 'react';
import { useGetDataReleases } from 'hooks/queries/useGetDataReleases';
import type {
  GithubDataRelease,
  GithubReleaseAsset,
} from 'hooks/queries/useGetDataReleases';

// components
import { Link, Paper, Typography } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { LoadingSpinner } from 'components/Shared/LoadingSpinner/LoadingSpinner';

// style
import './Files.scss';

function getReleaseLabel(release: GithubDataRelease, index: number): string {
  const name = release.name || release.tag_name;
  return index === 0 ? `latest (${name})` : name;
}

function getAsset(
  release: GithubDataRelease,
  filename: string
): GithubReleaseAsset | undefined {
  return release.assets.find((asset) => asset.name === filename);
}

function getSqlDownloadAsset(
  release: GithubDataRelease
): GithubReleaseAsset | undefined {
  return release.assets.find((asset) => /\.sql(\.gz)?$/i.test(asset.name));
}

function renderAssetLink(asset: GithubReleaseAsset | undefined) {
  if (!asset) {
    return '-';
  }

  return (
    <a download href={asset.browser_download_url}>
      {asset.name}
    </a>
  );
}

export const Files: React.FC = () => {
  const { data: releases = [], isError, isLoading } = useGetDataReleases();

  if (isLoading) {
    return (
      <div className="about-section-container doc-section">
        <LoadingSpinner />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="about-section-container doc-section">
        <Typography className="downloads-message">
          Data releases could not be loaded from GitHub. View releases directly
          at{' '}
          <Link
            href="https://github.com/dgidb/dgidb-data/releases"
            target="_blank"
            rel="noopener noreferrer"
          >
            dgidb-data releases
          </Link>
          .
        </Typography>
      </div>
    );
  }

  return (
    <div className="about-section-container doc-section">
      <p>
        TSV download of all gene claims, drug claims, and drug-gene interaction
        claims in DGIdb from all sources that were mapped to valid genes or
        drugs. For ease of use, we recommend working directly with the API or
        SQL database dump.
      </p>
      <TableContainer component={Paper} className="downloads-table">
        <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell align="center">Interactions</TableCell>
              <TableCell align="center">Genes</TableCell>
              <TableCell align="center">Drugs</TableCell>
              <TableCell align="center">Categories</TableCell>
              <TableCell align="center">SQL</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {releases.map((release, index) => (
              <TableRow
                key={release.tag_name}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {getReleaseLabel(release, index)}
                </TableCell>
                <TableCell align="center">
                  {renderAssetLink(getAsset(release, 'interactions.tsv'))}
                </TableCell>
                <TableCell align="center">
                  {renderAssetLink(getAsset(release, 'genes.tsv'))}
                </TableCell>
                <TableCell align="center">
                  {renderAssetLink(getAsset(release, 'drugs.tsv'))}
                </TableCell>
                <TableCell align="center">
                  {renderAssetLink(getAsset(release, 'categories.tsv'))}
                </TableCell>
                <TableCell align="center">
                  {renderAssetLink(getSqlDownloadAsset(release))}
                </TableCell>
              </TableRow>
            ))}
            {releases.length === 0 && (
              <TableRow>
                <TableCell colSpan={6}>
                  <Typography>
                    No data releases are currently available.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};
