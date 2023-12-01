// hooks/dependencies
import { useState } from 'react';
import './API.scss';
import { API_URL } from 'config';

// graphiql
import { GraphiQL } from 'graphiql';
import { createGraphiQLFetcher } from '@graphiql/toolkit';

// styles
import 'graphiql/graphiql.min.css';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const CopyToClipboard = require('react-copy-to-clipboard');

const buttonStyle = {
  color: 'var(--text-content)',
  backgroundColor: 'var(--background-light)',
  border: 'none',
  fontSize: '10px',
};
const defaultStyle = {
  backgroundColor: '#f3e5f5',
};

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
        interactionAttributes {
          name
          value
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
        interactionAttributes {
          name
          value
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
`;

const query5 = `
{
  drugs(first:100 after:"NTA") {
    pageInfo {
      startCursor
      endCursor
      hasNextPage
      hasPreviousPage
    }
    pageCount
    edges {
      cursor
      node {
        name
        conceptId
        approved
      }
    }
  }
}
`;

const query6 = `
{
  genes(first:100 after:"NTA") {
    pageInfo {
      startCursor
      endCursor
      hasNextPage
      hasPreviousPage
    }
    pageCount
    edges {
      cursor
      node {
        name
        conceptId
        longName
        geneCategories {
          name
        }
      }
    }
  }
}
`;

const fetcher = createGraphiQLFetcher({ url: API_URL ?? '' });

export const API = () => {
  const [isCopied, setIsCopied] = useState(false);

  const onCopyText = () => {
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 1000);
  };

  const sectionsMap = [
    {
      header: 'Find Interactions (by Drug)',
      sectionContent: (
        <>
          Identify drug-gene interactions across 40 aggregate sources per{' '}
          <i>n</i> drug inputs. <br />
          <br />
          <CopyToClipboard text={query1} onCopy={onCopyText}>
            <span>
              {isCopied ? (
                <Button style={buttonStyle}>Copied!</Button>
              ) : (
                <Button style={buttonStyle}>Copy Query to Clipboard</Button>
              )}
            </span>
          </CopyToClipboard>
          <pre>
            <code>{query1}</code>
          </pre>
        </>
      ),
    },
    {
      header: 'Find Interactions (by Gene)',
      sectionContent: (
        <>
          Identify drug-gene interactions across 40 aggregate sources per{' '}
          <i>n</i> gene inputs. <br />
          <br />
          <CopyToClipboard text={query2} onCopy={onCopyText}>
            <span>
              {isCopied ? (
                <Button style={buttonStyle}>Copied!</Button>
              ) : (
                <Button style={buttonStyle}>Copy Query to Clipboard</Button>
              )}
            </span>
          </CopyToClipboard>
          <pre>
            <code>{query2}</code>
          </pre>
        </>
      ),
    },
    {
      header: 'Drug Attributes and Approval Enums',
      sectionContent: (
        <>
          Identify drug attributes, approval values, and active ANDA/NDA
          applications per <i>n</i> drug inputs <br /> <br />
          <CopyToClipboard text={query3} onCopy={onCopyText}>
            <span>
              {isCopied ? (
                <Button style={buttonStyle}>Copied!</Button>
              ) : (
                <Button style={buttonStyle}>Copy Query to Clipboard</Button>
              )}
            </span>
          </CopyToClipboard>
          <pre>
            <code>{query3}</code>
          </pre>
        </>
      ),
    },
    {
      header: 'Gene Category Annotations',
      sectionContent: (
        <>
          Identify annotations for druggability and clinical actionability per{' '}
          <i>n</i> gene inputs <br /> <br />
          <CopyToClipboard text={query4} onCopy={onCopyText}>
            <span>
              {isCopied ? (
                <Button style={buttonStyle}>Copied!</Button>
              ) : (
                <Button style={buttonStyle}>Copy Query to Clipboard</Button>
              )}
            </span>
          </CopyToClipboard>
          <pre>
            <code>{query4}</code>
          </pre>
        </>
      ),
    },
    {
      header: 'Pagination Example (all Drugs)',
      sectionContent: (
        <>
          An example of cursor-based approach to paginating through all
          available drug records in DGIdb (in increments of 100 records).
          <br />
          <br />
          Use cursor location in conjunction with <i>before</i> and <i>after</i>{' '}
          keywords to paginate through additional records.
          <br />
          <br />
          <CopyToClipboard text={query5} onCopy={onCopyText}>
            <span>
              {isCopied ? (
                <Button style={buttonStyle}>Copied!</Button>
              ) : (
                <Button style={buttonStyle}>Copy Query to Clipboard</Button>
              )}
            </span>
          </CopyToClipboard>
          <pre>
            <code>{query5}</code>
          </pre>
        </>
      ),
    },
    {
      header: 'Pagination Example (all Genes)',
      sectionContent: (
        <>
          An example of cursor-based approach to paginating through all
          available gene records in DGIdb (in increments of 100 records).
          <br />
          <br />
          Use cursor location in conjunction with <i>before</i> and <i>after</i>{' '}
          keywords to paginate through additional records.
          <br />
          <br />
          <CopyToClipboard text={query6} onCopy={onCopyText}>
            <span>
              {isCopied ? (
                <Button style={buttonStyle}>Copied!</Button>
              ) : (
                <Button style={buttonStyle}>Copy Query to Clipboard</Button>
              )}
            </span>
          </CopyToClipboard>
          <pre>
            <code>{query6}</code>
          </pre>
        </>
      ),
    },
  ];

  return (
    <div>
    <div className="api-info-container">
      <div className="api-page-header">API Documentation</div>
      <p>The DGIdb API can be used to query for drug-gene interactions in your own applications.</p>
      <p>To query the API, make GraphQL queries to: <code>https://dgidb.org/api/graphql</code></p>
      <p>For examples and to experiment with API requests in your browser, refer to the Playground below.</p>
      </div>
    <div className="playground-page-header">Playground</div>
    <div className="playground-page-container">
      <div className="collapse-group">
        {sectionsMap.map((section) => {
          return (
            <Accordion key={section.header}>
              <AccordionSummary
                style={{
                  padding: '0 10px',
                  backgroundColor: 'var(--background-light)',
                }}
                expandIcon={<ExpandMoreIcon />}
              >
                <h5>
                  <b>{section.header}</b>
                </h5>
              </AccordionSummary>
              <AccordionDetails
                style={{
                  maxHeight: '350px',
                  overflow: 'scroll',
                  padding: '5px',
                }}
              >
                {section.sectionContent}
              </AccordionDetails>
            </Accordion>
          );
        })}
      </div>
      <div className="main">
        <GraphiQL fetcher={fetcher} />
      </div>
    </div>
    </div>
  );
};
