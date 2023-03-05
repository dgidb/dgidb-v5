// hooks/dependencies
import React, { useState, useContext, useEffect} from 'react';
import './Playground.scss';

// styles
import { Button, Collapse } from 'antd';

const { Panel } = Collapse;
const buttonStyle = {
  color: 'var(--text-content)', 
  backgroundColor: 'var(--background-light)',
  border: 'none'
};
const defaultStyle = {
  backgroundColor: 'var(--background-light)'
}

// queries
const query1 = `
query targetDetails{
  target(q:{sym:"ACE2"}) {
    name
    tdl
    fam
    sym
    description
    novelty
  }
}`;

const query2 = `
query diseaseDetails{
  disease(name:"asthma"){
    name
    mondoDescription
    uniprotDescription
    doDescription
    targetCounts {
      name
      value
    }
    children {
      name
      mondoDescription
    }
  }
}`;

const query3 = `
query ligandDetails{
  ligand(ligid: "haloperidol") {
    name
    description
    isdrug
    synonyms {
      name
      value
    }
    smiles
    activities {
      target {
        sym
      }
      type
      value
    }
  }
}`;

export const Playground = () => {
  return(
    <div className="playground-page-container" > 
      <div className="collapse-group"> 
        <Collapse accordion style={defaultStyle}>
          <Panel header="Example Query 1" key="1" style={defaultStyle}>
            <Button onClick={() => setQuery(query1)} style={buttonStyle}>Run Query</Button>
            <pre><code>{query1}</code></pre>
          </Panel>
          <Panel header="Example Query 2" key="2" style={defaultStyle}>
            <Button onClick={() => setQuery(query2)} style={buttonStyle}>Run Query</Button>
            <pre><code>{query2}</code></pre>
          </Panel>
          <Panel header="Example Query 3" key="3" style={defaultStyle}>
            <Button onClick={() => setQuery(query3)} style={buttonStyle}>Run Query</Button>
            <pre><code>{query3}</code></pre>
          </Panel>
        </Collapse>
      </div>
      <div className="main">
        <iframe id="playground" src={""} height="700" width="1500" />
      </div>
    </div>
  )
}

function setQuery(newUrl: string) {
   var playgroundiframe = document.getElementById('playground') as HTMLImageElement | null;
   //const url = `EXAMPLELINK/graphql?query=${encodeURI(newUrl)}`; // Link To be Replaced
   const url = "";
   if(playgroundiframe != null) playgroundiframe.src = url;
}

