// hooks/dependencies
import React, { useState, useContext, useEffect } from 'react';

// components
import { Info } from './SubSections/Info';
import { Files } from './SubSections/Files';

// styles
import './Downloads.scss';

export const Downloads = () => {
  return (
    <div className="downloads-page-container">
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
  );
};
