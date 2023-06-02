//dependencies
import React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

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
      <p>The files will go here</p>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell align="right">Interactions</TableCell>
              <TableCell align="right">Genes</TableCell>
              <TableCell align="right">Drugs</TableCell>
              <TableCell align="right">Categories</TableCell>
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
                <TableCell align="right">
                  <a
                    download
                    href={'data/' + row.date + '/' + row.interactions}
                  >
                    {row.interactions}
                  </a>
                </TableCell>
                <TableCell align="right">
                  <a download href={'data/' + row.date + '/' + row.genes}>
                    {row.genes}
                  </a>
                </TableCell>
                <TableCell align="right">
                  <a download href={'data/' + row.date + '/' + row.drugs}>
                    {row.drugs}
                  </a>
                </TableCell>
                <TableCell align="right">
                  <a
                    download
                    href={'data/' + row.date + '/' + row.interactions}
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
