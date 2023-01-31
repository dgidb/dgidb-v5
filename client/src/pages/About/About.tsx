// hooks/dependencies
import React, { useState, useContext, useEffect} from 'react';

// components
import { Overview } from './SubSections/Overview';
import { Publications } from './SubSections/Publications';
import { TypesAndDirectionalities } from './SubSections/TypesAndDirectionalities';
import { InteractionScoreQueryScore } from './SubSections/InteractionScoreQueryScore';
import { FAQ } from './SubSections/FAQ';
import { KnownDataClients } from './SubSections/KnownDataClients';
import { Contact } from './SubSections/Contact';
import { TypesTable } from 'components/About/InteractionClaimTypes/TypesTable'


// styles
import './About.scss';
import { Anchor } from 'antd';

const { Link } = Anchor;

export const About = () => {

  return(
    <div className="about-page-container">
      <div className="table-of-contents-container">
        <Anchor affix={true} style={{color: 'red'}}>
          <Link href="#about" title="About" />
          <Link href="#publications" title="Publications" />
          <Link href="#interaction-types" title="Types/Directionalities" />
          <Link href="#interaction-scores" title="Score/Query Score" />
          {/* <Link href="#api-documentation" title="API Documentation" /> */}
          <Link href="#faq" title="FAQ" />
          <Link href="#known-data-clients" title="Known Data Clients" />
          <Link href="#contact" title="Contact" />
        </Anchor>
      </div>
      <div className="about-content-container">
        <div className="doc-section">
         <h3 id="about">About</h3>
          <Overview />
        </div>
        <div className="doc-section">
        <h3 id="publications">Publications</h3>
          <Publications />
        </div>
        <div className="doc-section">
        <h3 id="interaction-types">Interaction Types and Directionalities</h3>
          <TypesAndDirectionalities />
          <TypesTable/>
        </div>
        <div className="doc-section">
        <h3 id="interaction-scores">Interaction Score and Query Score</h3>
          <InteractionScoreQueryScore />
        </div>
        <div className="doc-section">
        <h3 id="faq">FAQ</h3>
          <FAQ />
        </div>
        <div className="doc-section">
        <h3 id="known-data-clients">KnownDataClients</h3>
          <KnownDataClients />
        </div>
        <div className="doc-section">
        <h3 id="contact">Contact</h3>
          <Contact />
        </div>
      </div>
    </div>
  )
}