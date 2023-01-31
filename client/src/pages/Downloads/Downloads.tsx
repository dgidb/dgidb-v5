// hooks/dependencies
import React, { useState, useContext, useEffect} from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';


// components
import { Info } from './SubSections/Info';
import { Interactions } from './SubSections/Interactions';
import { Genes } from './SubSections/Genes';
import { Drugs } from './SubSections/Drugs';
import { Categories } from './SubSections/Categories';
import { Files } from './SubSections/Files';


// styles
import './Downloads.scss';
import { Anchor } from 'antd';

const { Link } = Anchor;
function createData(
  date: string,
  interactions: string,
  genes: string,
  drugs: string,
  categories: string,
) {
  return { date, interactions, genes, drugs, categories };
}

const rows = [
  createData('2022-Feb', 'interactions.tsv', 'genes.tsv', 'drugs.tsv', 'categories.tsv'),
  createData('2021-May', 'interactions.tsv', 'genes.tsv', 'drugs.tsv', 'categories.tsv'),
  createData('2021-Jan', 'interactions.tsv', 'genes.tsv', 'drugs.tsv', 'categories.tsv'),
  createData('2020-Nov', 'interactions.tsv', 'genes.tsv', 'drugs.tsv', 'categories.tsv'),
  createData('2020-Oct', 'interactions.tsv', 'genes.tsv', 'drugs.tsv', 'categories.tsv'),
  createData('2020-Sep', 'interactions.tsv', 'genes.tsv', 'drugs.tsv', 'categories.tsv'),
];


export const Downloads = () => {

  return(
    <div className="downloads-page-container">
      <div className="table-of-contents-container">
        <Anchor affix={true} style={{color: 'red'}}>
          <Link href="#about" title="About" />
          <Link href="#interactions" title="Interactions" />
          <Link href="#genes" title="Genes" />
          <Link href="#drugs" title="Drugs" />
          {/* <Link href="#api-documentation" title="API Documentation" /> */}
          <Link href="#categories" title="Categories" />
          <Link href="#files" title="Files" />
        </Anchor>
      </div>
      <div className="about-content-container">
        <div className="doc-section">
         <h3 id="about">Downloads</h3>
          <Info />
        </div>
        <div className="doc-section">
         <h3 id="about">Files</h3>
          <Files />
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
              <TableCell align="right">{row.interactions}</TableCell>
              <TableCell align="right">{row.genes}</TableCell>
              <TableCell align="right">{row.drugs}</TableCell>
              <TableCell align="right">{row.categories}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
        </div>
      </div>

    </div>
  )
}