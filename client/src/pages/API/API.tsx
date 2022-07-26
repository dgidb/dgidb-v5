// hooks/dependencies
import { Anchor, Divider, Table, Typography } from 'antd';
import React, { useState, useContext, useEffect} from 'react';
import { GlobalClientContext } from 'stores/Global/GlobalClient';
import './API.scss';
import { Collapse } from 'antd';
import { ExampleResponse } from './ExampleResponse';

const { Panel } = Collapse;
const { Link } = Anchor;

export const API = () => {
  const {state, dispatch} = useContext(GlobalClientContext);
  console.log(state?.themeSettings)
  const interactionTableData = [
    {
      parameter: 'genes / drugs (required)',
      description: 'A comma delimited list of gene or drug names/symbols.',
      example: <><code>genes=FLT1,STK1,FAKE1</code> or <code>drugs=FICLATUZUMAB,ETOPOSIDE,NOTREAL</code></>
    },
    {
      parameter: 'interaction_sources (optional)',
      description: 'A comma delimited list of source names to include in the result set. If this field is omitted, all sources will be included.',
      example: <code>interaction_sources=TTD,DrugBank</code>
    },
    {
      parameter: 'interaction_types (optional)',
      description: 'A comma delimited list of interaction types to include in the result set. If this field is omitted, all interaction types will be included.	',
      example: <code>interaction_types=inhibitor,activator</code>
    },
    {
      parameter: 'fda_approved_drug (optional)',
      description: 'A flag denoting whether or not to limit interactions to only the ones involving fda-approved drugs. If this field is omitted, interactions for all types of drugs will be included.	',
      example: <code>fda_approved_drug=true</code>
    },
    {
      parameter: 'immunotherapy (optional)',
      description: 'A flag denoting whether or not to limit interactions to only the ones involving immunotherapeutic drugs. If this field is omitted, interactions for all types of drugs will be included.	',
      example: <code>immunotherapy=true</code>
    },
    {
      parameter: 'anti_neoplastic (optional)',
      description: 'A flag denoting whether or not to limit interactions to only the ones involving antineoplastic drugs. If this field is omitted, interactions for all types of drugs will be included.	',
      example: <code>anti_neoplastic=true</code>
    },
    {
      parameter: 'clinically_actionable (optional)',
      description: 'A flag denoting whether or not to limit interactions to only the ones involving clinically actionable genes. If this field is omitted, interactions for all types of genes will be included.	',
      example: <code>clinically_actionable=true</code>
    },
    {
      parameter: 'druggable_genome (optional)',
      description: 'A flag denoting whether or not to limit interactions to only the ones involving the durggable genome. If this field is omitted, interactions for all types of genes will be included.	',
      example: <code>druggable_genome=true</code>
    },
    {
      parameter: 'drug_resistance (optional)',
      description: 'A flag denoting whether or not to limit interactions to only the ones involving drug-resistant genes. If this field is omitted, interactions for all types of genes will be included.	',
      example: <code>drug_resistance=true</code>
    },
    {
      parameter: 'gene_categories (optional)',
      description: 'A comma delimited list of gene categories to include in the result set. If this field is omitted, all gene categories will be included.	',
      example: <code>gene_categories=kinase,tumor%20suppressor</code>
    },
    {
      parameter: 'source_trust_levels (optional)',
      description: 'A comma delimited list of source trust levels to include in the result set. If this field is omitted, all trust levels will be included.	',
      example: <code>source_trust_levels=Expert%20curated</code>
    },
  ]
  const acceptedParametersTableColumns = [
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

  const allInteractionsTableColumns = [
    {
      title: 'Parameter',
      dataIndex: 'parameter',
      key: 'parameter'
    },
    {
      title: 'Default',
      dataIndex: 'default',
      key: 'default'
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description'
    },
  ]

  const getQueryParametersTable = (tableName: string) => {
    return [
      { 
        parameter: 'page',
        default: 1,
        description: 'Which page of results to return'
      },
      { 
        parameter: 'count',
        default: 25,
        description: `How many ${tableName} to return on a single page`
      }
    ]
  }

  return (
    <div className="api-page-container">
        <div className="table-of-contents-container">
          <Anchor affix={true} style={{color: 'red'}}>
            <Link href='#introduction' className='anchor-header' title='Introduction' />
            <Divider className='divider' />
            <Link href='#endpoints' className='anchor-header' title='endpoints' />

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

            <Link href='#responses' className='anchor-header' title='Responses' />
            <Link href="#formats" title="Formats" />
            <Link href="#status-codes" title="Status Codes" />
            <Divider className='divider' />

            <Link href='#sample-code' className='anchor-header' title='Sample Code'/>
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
        </div>
        <div className="endpoints-section">
            <h1 id='endpoints'>Endpoints</h1>
            <Divider className="divider" />
            <h3 id='interactions'>Interactions</h3>

            <h4 id='search-interactions'>Search Interactions</h4>
            <p>The interactions endpoint can be used to return interactions for a given set of gene or drug names/symbols. It also allows you to filter returned interactions.</p>
            <p className='badge get'>GET</p>
            <pre>{"/api/v2/interactions.json?<parameters>"}</pre>
            <div className='info-subsection note-section'>
              <label className='badge'>Note: </label>
              <p>While the preferred method for accessing this endpoint is a <code>GET</code> request, it will also accept <code>POST</code> requests to accommodate large gene lists if needed.</p>
            </div>

            <h5>Accepted Parameters:</h5>
            
            <Table dataSource={interactionTableData} columns={acceptedParametersTableColumns} className='ant-table' pagination={false} />
            <h5>Example Call: </h5>
            <div className='info-subsection note-section'>
              <p className='badge'>Note: </p>
              <p>The following example would query DGIdb for interactions involving the genes FLT1, STK1, and FAKE. It will only show interactions reported by the source. TALC.</p>
            </div>
            <pre>https://dgidb.org/api/v2/interactions.json?genes=FLT1,MM1,FAKE&interaction_sources=TALC</pre>

            <h5>Example Response: </h5>
            <div className='info-subsection'>
              <p>The response will come back with three top level items:</p>
              <p><code>matchedTerms</code> will be a list containing a hash for each search term that you provided that we were able to map unambiguously to an Entrez gene. Each hash will contain your original search term, the Entrez long and full names that DGIdb matched them to as well as a list of categories that the given gene is in. Additionally, the hash will contain a list of drug interactions for the gene. This list includes interaction type information as well as the drug name and source that reported the interaction.</p>
              <p><code>ambiguousTerms</code> will be a list containing a hash of search terms that you provided that mapped to multiple Entrez genes. Each hash will contain your original search term, the Entrez long and full names of the potential math as well as a list of categories that the given gene is in. Additionally, the hash will contain a list of drug interactions for the gene. This list includes interaction type information as well as the drug name and source that reported the interaction.</p>
              <p><code>unmatchedTerms</code> will be a list of search terms you provided that we were unable to map any Entrez gene.</p>
            </div>
            <Divider />

            <h4 id='all-interactions'>All Interactions</h4>
            <p>When used without a <code>genes</code> or <code>drugs</code> parameter, the interactions endpoint returns a list of all interactions in the DGIdb database. This is an index style endpoint and is paginated by default. You can use the <code>count</code> and <code>page</code> parameters to iterate through all the variants.</p>
            <p className='badge get'>GET</p>
            <pre>https://dgidb.org/api/v2/interactions</pre>
            <h5>Query Parameters: </h5>
            <Table dataSource={getQueryParametersTable('interactions')} columns={allInteractionsTableColumns} className='ant-table' pagination={false} />
            <Collapse>
              <Panel header="Show/Hide Response" key="1">
                <pre>{ExampleResponse.all_interactions}</pre>
              </Panel>
            </Collapse>
            <Divider />

            <h4 id='interaction-details'>Interaction Details</h4>
            <p>The interaction details endpoint can be used to retrieve detailed information about one particular interaction.</p>
            <p className='badge get'>GET</p>
            <pre>{"https://dgidb.org/api/v2/interactions/<interaction_id>"}</pre>
            <h5>Example Call: </h5>
            <div className='info-subsection note-section'>
              <p className='badge'>Note: </p>
              <p>The following example would query DGIdb for for the interaction with ID <code>001098f2-1b60-4c87-b3dd-245eb04ede43</code></p>
            </div>
            <pre>https://dgidb.org/api/v2/interactions/001098f2-1b60-4c87-b3dd-245eb04ede43</pre>
            <Collapse>
              <Panel header="Show/Hide Response" key="1">
                <pre>{ExampleResponse.interaction_details}</pre>
              </Panel>
            </Collapse>
            <Divider />

            <h3 id='drugs'>Drugs</h3>
            <h4 id='all-drugs'>All Drugs</h4>
            <p>The drugs endpoint can be used to retrieve a list of all drugs in the DGIdb database. This is an index style endpoint and is paginated by default. You can use the <code>count</code> and <code>page</code> parameters to iterate through all the variants.</p>
            <p className='badge get'>GET</p>
            <pre>https://dgidb.org/api/v2/drugs</pre>
            <h5>Query Parameters: </h5>
            <Table dataSource={getQueryParametersTable('drugs')} columns={allInteractionsTableColumns} pagination={false} />
            <Collapse>
              <Panel header="Show/Hide Response" key="1">
                <pre>{ExampleResponse.all_drugs}</pre>
              </Panel>
            </Collapse>

            <Divider />

            <h4 id='drug-details'>Drug Details</h4>

            <Collapse>
              <Panel header="Show/Hide Response" key="1">
                <pre>{ExampleResponse.drug_details}</pre>
              </Panel>
            </Collapse>

            <Divider />

            <h3 id='genes'>Genes</h3>
            <h4 id='all-genes'>All Genes</h4>
            <p>The genes endpoint can be used to retrieve a list of all genes in the DGIdb database. This is an index style endpoint and is paginated by default. You can use the <code>count</code> and <code>page</code> parameters to iterate through all the variants.</p>
            <p className='badge get'>GET</p>
            <pre>https://dgidb.org/api/v2/drugs</pre>
            <h5>Query Parameters: </h5>
            <Table dataSource={getQueryParametersTable('genes')} columns={allInteractionsTableColumns} pagination={false} />
            <Collapse>
              <Panel header="Show/Hide Response" key="1">
                <pre>{ExampleResponse.all_genes}</pre>
              </Panel>
            </Collapse>

            <Divider />

            <h4 id='gene-details'>Gene Details</h4>

            <Collapse>
              <Panel header="Show/Hide Response" key="1">
                <pre>{ExampleResponse.gene_details}</pre>
              </Panel>
            </Collapse>

            <Divider />

            <h3 id='interaction-types'>Interaction Types</h3>

            <Collapse>
              <Panel header="Show/Hide Response" key="1">
                <pre>{ExampleResponse.interaction_types}</pre>
              </Panel>
            </Collapse>

            <Divider />

            <h3 id='interaction-sources'>Interaction Sources</h3>

            <Collapse>
              <Panel header="Show/Hide Response" key="1">
                <pre>{ExampleResponse.interaction_sources}</pre>
              </Panel>
            </Collapse>

            <Divider />

            <h3 id='gene-categories'>Gene Categories</h3>

            <Collapse>
              <Panel header="Show/Hide Response" key="1">
                <pre>{ExampleResponse.gene_categories}</pre>
              </Panel>
            </Collapse>

            <Divider />

            <h3 id='source-trust-levels'>Source Trust Levels</h3>

            <Collapse>
              <Panel header="Show/Hide Response" key="1">
                <pre>{ExampleResponse.source_trust_levels}</pre>
              </Panel>
            </Collapse>

            <Divider />

            <h3 id='genes-in-category'>Genes in Category</h3>

            <Collapse>
              <Panel header="Show/Hide Response" key="1">
                <pre>{ExampleResponse.genes_in_category}</pre>
              </Panel>
            </Collapse>

            <Divider />


        </div>
        <div className="responses-section">
            <h1 id='responses'>Responses</h1>
            <Divider className='divider' />

            <h3 id='formats'>Formats</h3>

            <Divider />

            <h3 id='status-codes'>Status Codes</h3>

            <Divider />

        </div>
        <div className="sample-code-section">
            <h1 id='sample-code'>Sample Code</h1>
            <Divider className='divider' />

            <h3 id='perl'><a href='https://github.com/genome/dgi-db/blob/master/files/perl_example.pl'>Perl</a></h3>

            <Divider />

            <h3 id='python'><a href='https://github.com/genome/dgi-db/blob/master/files/python_example.py'>Python</a></h3>

            <Divider />

            <h3 id='ruby'><a href='https://github.com/genome/dgi-db/blob/master/files/ruby_example.rb'>Ruby</a></h3>

            <Divider />

            <h3 id='shell'><a href='https://github.com/genome/dgi-db/blob/master/files/shell_example.sh'>Shell</a></h3>

            <Divider />
        </div>
      </div>
    </div>
  )
}
