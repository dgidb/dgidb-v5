// dependencies
import React from 'react';

// components
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

// style
import './Files.scss';

function createData(
  date: string,
  interactions: string,
  genes: string,
  drugs: string,
  categories: string
) {
  return { date, interactions, genes, drugs, categories };
}

const rows = [
  createData(
    '2023-Dec',
    'interactions.tsv',
    'genes.tsv',
    'drugs.tsv',
    'categories.tsv'
  ),
  createData(
    '2022-Feb',
    'interactions.tsv',
    'genes.tsv',
    'drugs.tsv',
    'categories.tsv'
  ),
  createData(
    '2021-May',
    'interactions.tsv',
    'genes.tsv',
    'drugs.tsv',
    'categories.tsv'
  ),
  createData(
    '2021-Jan',
    'interactions.tsv',
    'genes.tsv',
    'drugs.tsv',
    'categories.tsv'
  ),
  createData(
    '2020-Nov',
    'interactions.tsv',
    'genes.tsv',
    'drugs.tsv',
    'categories.tsv'
  ),
  createData(
    '2020-Oct',
    'interactions.tsv',
    'genes.tsv',
    'drugs.tsv',
    'categories.tsv'
  ),
  createData(
    '2020-Sep',
    'interactions.tsv',
    'genes.tsv',
    'drugs.tsv',
    'categories.tsv'
  ),
];

export const Files = () => {
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
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={row.date}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.date}
                </TableCell>
                <TableCell align="center">
                  <a
                    download
                    href={'data/' + row.date + '/' + row.interactions}
                  >
                    {row.interactions}
                  </a>
                </TableCell>
                <TableCell align="center">
                  <a download href={'data/' + row.date + '/' + row.genes}>
                    {row.genes}
                  </a>
                </TableCell>
                <TableCell align="center">
                  <a download href={'data/' + row.date + '/' + row.drugs}>
                    {row.drugs}
                  </a>
                </TableCell>
                <TableCell align="center">
                  <a
                    download
                    href={'data/' + row.date + '/' + row.categories}
                  >
                    {row.categories}
                  </a>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};
