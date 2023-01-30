// hooks/dependencies
import React, { useState, useContext, useEffect} from 'react';

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
         <h3 id="about">Interactions</h3>
          <Interactions />
        </div>
        <div className="doc-section">
         <h3 id="about">Genes</h3>
          <Genes />
        </div>
        <div className="doc-section">
         <h3 id="about">Drugs</h3>
          <Drugs />
        </div>
        <div className="doc-section">
         <h3 id="about">Categories</h3>
          <Categories />
        </div>
        <div className="doc-section">
         <h3 id="about">Files</h3>
          <Files />
        </div>
      </div>

    </div>
  )
}