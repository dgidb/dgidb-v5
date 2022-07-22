// hooks/dependencies
import { Anchor, Divider, Table, Typography } from 'antd';
import React, { useState, useContext, useEffect} from 'react';
import './API.scss';

const { Link } = Anchor;

export const API = () => {
  const search_string = "/api/v2/interactions.json?<parameters>"
  const interactionTableData = [
    {
      parameter: 'genes / drugs (required)',
      description: 'A comma delimited list of gene or drug names/symbols.',
      example: ''
    },
    {
      parameter: 'interaction_sources (optional)',
      description: 'A comma delimited list of source names to include in the result set. If this field is omitted, all sources will be included.',
      example: ''
    },
    {
      parameter: 'interaction_types (optional)	',
      description: 'A comma delimited list of interaction types to include in the result set. If this field is omitted, all interaction types will be included.	',
      example: ''
    },
    {
      parameter: 'fda_approved_drug (optional)	',
      description: 'A flag denoting whether or not to limit interactions to only the ones involving fda-approved drugs. If this field is omitted, interactions for all types of drugs will be included.	',
      example: ''
    },
    {
      parameter: 'immunotherapy (optional)	',
      description: 'A flag denoting whether or not to limit interactions to only the ones involving immunotherapeutic drugs. If this field is omitted, interactions for all types of drugs will be included.	',
      example: ''
    },
    {
      parameter: 'anti_neoplastic (optional)	',
      description: 'A flag denoting whether or not to limit interactions to only the ones involving antineoplastic drugs. If this field is omitted, interactions for all types of drugs will be included.	',
      example: ''
    },
    {
      parameter: 'clinically_actionable (optional)	',
      description: 'A flag denoting whether or not to limit interactions to only the ones involving clinically actionable genes. If this field is omitted, interactions for all types of genes will be included.	',
      example: ''
    },
    {
      parameter: 'druggable_genome (optional)	',
      description: 'A flag denoting whether or not to limit interactions to only the ones involving the durggable genome. If this field is omitted, interactions for all types of genes will be included.	',
      example: ''
    },
    {
      parameter: 'drug_resistance (optional)	',
      description: 'A flag denoting whether or not to limit interactions to only the ones involving drug-resistant genes. If this field is omitted, interactions for all types of genes will be included.	',
      example: ''
    },
    {
      parameter: 'gene_categories (optional)	',
      description: 'A comma delimited list of gene categories to include in the result set. If this field is omitted, all gene categories will be included.	',
      example: ''
    },
    {
      parameter: 'source_trust_levels (optional)	',
      description: 'A comma delimited list of source trust levels to include in the result set. If this field is omitted, all trust levels will be included.	',
      example: ''
    },
  ]
  const interactionTableColumns = [
    {
      title: 'Parameter',
      dataIndex: 'parameter',
      key: 'parameter'
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description'
    },
    {
      title: 'Example',
      dataIndex: 'example',
      key: 'example'
    }
  ]

  return (
    <div className="api-page-container">
        <div className="table-of-contents-container">
          <Anchor affix={true} style={{color: 'red'}}>
            <Typography className='anchor-header'>Introduction</Typography>
            <Divider className='divider' />
            <Typography className='anchor-header'>Endpoints</Typography>

            <Link href="#interactions" title="Interactions" />
            <Link href="#search-interactions" title="Search Interactions" className="sub-subsection" />
            <Link href="#all-interactions" title="All Interactions" className="sub-subsection" />
            <Link href="#interactions-details" title="Interaction Details" className="sub-subsection" />

            <Link href="#drugs" title="Drugs" />
            <Link href="#all-drugs" title="All Drugs" className="sub-subsection" />
            <Link href="#drug-details" title="Drug Details" className="sub-subsection" />

            <Link href="#genes" title="Genes" />
            <Link href="#all-genes" title="All Genes" className="sub-subsection" />
            <Link href="#gene-details" title="Gene Details" className="sub-subsection" />

            <Link href="#interaction-types" title="Interaction Types" />
            <Link href="#interaction-sources" title="Interaction Sources" />
            <Link href="#gene-categories" title="Gene Categories" />
            <Link href="#source-trust-levels" title="Source Trust Levels" />
            <Link href="#genes-in-category" title="Genes in Category" />
            <Divider className='divider' />

            <Typography className='anchor-header'>Responses</Typography>
            <Link href="#formats" title="Formats" />
            <Link href="#status-codes" title="Status Codes" />
            <Divider className='divider' />

            <Typography className='anchor-header'>Sample Code</Typography>
            <Link href="#perl" title="Perl" />
            <Link href="#python" title="Python" />
            <Link href="#ruby" title="Ruby" />
            <Link href="#shell" title="Shell" />
            <Divider className='divider' />
          </Anchor>
        </div>
      <div className='api-content-container'>
        <div className="introduction-section">
            <h1 id='introduction'>Introduction</h1>
            <Divider className="divider" />
            <p>The DGIdb API can be used to query for drug-gene interactions in your own applications through a simple JSON based interface.</p>
            <p>All endpoints can be reached at: <code>https://dgidb.org</code></p>
            <p>Documentation for v1 of the API (deprecated) can be found here. *DO WE STILL WANT TO INCLUDE THIS?*</p>
        </div>
        <div className="endpoints-section">
            <h1 id='endpoints'>Endpoints</h1>
            <Divider className="divider" />
            <h3 id='interactions'>Interactions</h3>
            <h4 id='search-interactions'>Search Interactions</h4>
            <p>The interactions endpoint can be used to return interactions for a given set of gene or drug names/symbols. It also allows you to filter returned interactions.</p>
            <label>GET</label>
            <pre>{search_string}</pre>
            <label>Note: </label>
            <p>While the preferred method for accessing this endpoint is a <code>GET</code> request, it will also accept <code>POST</code> requests to accommodate large gene lists if needed.</p>

            <h5>Accepted Parameters:</h5>
            
            <Table dataSource={interactionTableData} columns={interactionTableColumns} className='ant-table' pagination={false} />
            <h5>Example Call: </h5>
            <label>Note: </label>
            <p>The following example would query DGIdb for interactions involving the genes FLT1, STK1, and FAKE. It will only show interactions reported by the source. TALC.</p>
            <pre>https://dgidb.org/api/v2/interactions.json?genes=FLT1,MM1,FAKE&interaction_sources=TALC</pre>

            <h5>Example Response: </h5>
            <div className='info-subsection'>
              <p>The response will come back with three top level items:</p>
              <p><code>matchedTerms</code> will be a list containing a hash for each search term that you provided that we were able to map unambiguously to an Entrez gene. Each hash will contain your original search term, the Entrez long and full names that DGIdb matched them to as well as a list of categories that the given gene is in. Additionally, the hash will contain a list of drug interactions for the gene. This list includes interaction type information as well as the drug name and source that reported the interaction.</p>
              <p><code>ambiguousTerms</code> will be a list containing a hash of search terms that you provided that mapped to multiple Entrez genes. Each hash will contain your original search term, the Entrez long and full names of the potential math as well as a list of categories that the given gene is in. Additionally, the hash will contain a list of drug interactions for the gene. This list includes interaction type information as well as the drug name and source that reported the interaction.</p>
              <p><code>unmatchedTerms</code> will be a list of search terms you provided that we were unable to map any Entrez gene.</p>
            </div>

            <h4 id='all-interactions'>All Interactions</h4>
            <p>When used without a <code>genes</code> or <code>drugs</code> parameter, the interactions endpoint returns a list of all interactions in the DGIdb database. This is an index style endpoint and is paginated by default. You can use the <code>count</code> and <code>page</code> parameters to iterate through all the variants.</p>
            <label>GET</label>
            <pre>https://dgidb.org/api/v2/interactions</pre>

        </div>
        <div className="responses-section">
            <h1 id='responses'>Responses</h1>
        </div>
        <div className="sample-code-section">
            <h1 id='sample-code'>Sample Code</h1>
        </div>
      </div>
    </div>
  )
}
