// hooks/dependencies
import React, { useState, useContext, useEffect} from 'react';
import { BrowseCategories } from 'components/Browse/Categories';

// styles
import './Browse.scss';

export const Browse = () => {

  return (
    <div className="browse-page-container">
      <BrowseCategories />
    </div>
  )
}
