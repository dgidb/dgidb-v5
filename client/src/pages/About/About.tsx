// hooks/dependencies
import React, { useState, useContext, useEffect} from 'react';

// styles
import './About.scss';
import { Anchor } from 'antd';

const { Link } = Anchor;

export const About = () => {

  return(
    <div className="about-page-container">
      <Anchor affix={false}>
        <Link href="#components-anchor-demo-basic" title="Basic demo" />
        <Link href="#components-anchor-demo-static" title="Static demo" />
        <Link href="#API" title="API">
          <Link href="#Anchor-Props" title="Anchor Props" />
          <Link href="#Link-Props" title="Link Props" />
        </Link>
      </Anchor>
    </div>
  )
}