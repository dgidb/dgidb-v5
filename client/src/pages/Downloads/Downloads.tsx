// hooks/dependencies
import React, { useState, useContext, useEffect} from 'react';

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
          <Link href="#publications" title="Publications" />
          <Link href="#interaction-types" title="Types/Directionalities" />
          <Link href="#interaction-scores" title="Score/Query Score" />
          {/* <Link href="#api-documentation" title="API Documentation" /> */}
          <Link href="#faq" title="FAQ" />
          <Link href="#known-data-clients" title="Known Data Clients" />
          <Link href="#news" title="News" />
          <Link href="#contact" title="Contact" />
        </Anchor>
      </div>

      Downloads!
    </div>
  )
}