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
          <Link href="#downloads" title="Downloads" />
          <Link href="#files" title="Files" />
        </Anchor>
      </div>
      <div className="about-content-container">
        <div className="doc-section">
         <h3 id="downloads">Downloads</h3>
          <Info />
        </div>
        <div className="doc-section">
         <h3 id="files">Files</h3>
          <Files />
        </div>
      </div>
    </div>
  )
}