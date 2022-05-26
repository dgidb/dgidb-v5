// hooks/dependencies
import React, { useState, useContext, useEffect} from 'react';

// styles
import './About.scss';
import { Anchor } from 'antd';

const { Link } = Anchor;

export const About = () => {

  return(
    <div className="about-page-container">
      <Anchor affix={true} style={{color: 'red'}}>
        <Link href="#about" title="About" />
        <Link href="#publications" title="Publications" />
        <Link href="#interactions" title="Interactions">
          <Link href="#types" title="Types" />
          <Link href="#directionalities" title="Directionalities" />
          <Link href="#score" title="Score" />
          <Link href="#query-score" title="Query Score" />
        </Link>
        <Link href="#api-documentation" title="API Documentation" />
        <Link href="#faq" title="FAQ" />
        <Link href="#known-data-clients" title="Known Data Clients" />
        <Link href="#news" title="News" />
        <Link href="#contact" title="Contact" />
      </Anchor>
      <div className="about-content-container">
        <h3 id="about">About</h3>
        <h3 id="publications">Publications</h3>
        <h3 id="interactions">Interactions</h3>
        <h3 id="types">Types</h3>
        <h3 id="directionalities">Directionalities</h3>
        <h3 id="score">Score</h3>
        <h3 id="query-score">Query Score</h3>
        <h3 id="api-documentation">API Documentation</h3>
        <h3 id="faq">FAQ</h3>
        <h3 id="known-data-clients">Known Data Clients</h3>
        <h3 id="news">News</h3>
        <h3 id="contact">Contact</h3>
      </div>

    </div>
  )
}