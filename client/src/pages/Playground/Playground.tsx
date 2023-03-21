// hooks/dependencies
import React, { useState, useContext, useEffect} from 'react';
import './Playground.scss';

// graphiql
import { GraphiQL } from 'graphiql';
import { createGraphiQLFetcher } from '@graphiql/toolkit'

// styles
import { Button, Collapse } from 'antd';
import 'graphiql/graphiql.min.css';

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
{
  drugs(names: ["DOVITINIB"]) {
    nodes {
      interactions {
        gene {
          name
          conceptId
          longName
        }
        interactionScore
        interactionTypes {
          type
          directionality
        }
        publications {
          pmid
        }
        sources {
          sourceDbName
        }
      }
    }
  }
}
`;

const query2 = `
{
  genes(names: ["BRAF"]) {
    nodes {
      interactions {
        drug {
          name
          conceptId
        }
        interactionScore
        interactionTypes {
          type
          directionality
        }
        publications {
          pmid
        }
        sources {
          sourceDbName
        }
      }
    }
  }
}
`;

const query3 = `
{
  drugs(names: ["IMATINIB"]) {
    nodes {
      name
      conceptId
      approved
      immunotherapy
      antiNeoplastic
      drugAttributes {
        name
        value
      }
      drugApprovalRatings {
        rating
        source {
          sourceDbName
          sourceTrustLevel {
            level
          }
        }
      }
      drugApplications {
        appNo
      }
    }
  }
}
`;

const query4 = `
{
  genes(names: ["BRAF"]) {
    nodes {
      longName
      conceptId
      geneCategoriesWithSources {
        name
        sourceNames
      }
    }
  }
}
`

const fetcher = createGraphiQLFetcher({ url: 'http://localhost:3000/api/graphql'})

export const Playground = () => {
  return(
    <div className="playground-page-container" >
      <div className="collapse-group">
        <Collapse accordion style={defaultStyle}>
          <Panel header="Find Interactions (by Drug)" key="1" style={defaultStyle}>
            Identify drug-gene interactions across 40 aggregate sources per <i>n</i> drug inputs. <br/><br/>
            <Button onClick={() => setQuery(query1)} style={buttonStyle}>Copy Query to Clipboard</Button>
            <pre><code>{query1}</code></pre>
          </Panel>
          <Panel header="Find Interactions (by Gene)" key="2" style={defaultStyle}>
          Identify drug-gene interactions across 40 aggregate sources per <i>n</i> gene inputs. <br/><br/>
            <Button onClick={() => setQuery(query2)} style={buttonStyle}>Copy Query to Clipboard</Button>
            <pre><code>{query2}</code></pre>
          </Panel>
          <Panel header="Drug Attributes and Approval Enums" key="3" style={defaultStyle}>
          Identify drug attributes, approval values, and active ANDA/NDA applications per <i>n</i> drug inputs <br/> <br/>
            <Button onClick={() => setQuery(query3)} style={buttonStyle}>Copy Query to Clipboard</Button>
            <pre><code>{query3}</code></pre>
          </Panel>
          <Panel header="Gene Category Annotations" key="4" style={defaultStyle}>
          Identify annotations for druggability and clinical actionability per <i>n</i> gene inputs <br/> <br/>
            <Button onClick={() => setQuery(query3)} style={buttonStyle}>Copy Query to Clipboard</Button>
            <pre><code>{query3}</code></pre>
          </Panel>

        </Collapse>
      </div>
      <div className="main">
        <GraphiQL fetcher={fetcher}/>
        {/* <iframe id="playground" src={""} height="700" width="1500" /> */}
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

