import React from 'react';
import './DataModel.scss';

export const DataModel: React.FC = () => {
    return (
        <>
        <h1>Data Model</h1>

        <h4>Claims</h4>
        <p>A <b>claim</b> is an individual record imported from a source for a single gene, drug, or interaction. This claim contains the record name, aliases, and attributes as reported by the source. 
        </p>
        <h4>Groups</h4>
        <p>A <b>group</b> is a collection of claims that have been linked and ontologically grounded to their underlying concept. Groups are created for gene, drug, and interaction claims. For example, drug claims for Gleevac, Imatininb, and STI-571 that have been imported from different sources would be a group under the central identifier Imatinib.  </p>
        <h4>Interaction</h4>
        <p>An <b>interaction</b> is an observed or inferred interaction between gene products and drug compounds or small molecules. Interactions in DGIdb are imported from published literature or from publicly available databases.
        </p>
        <h4>Category</h4>
        <p>A <b>category</b> is an annotation that designates genes that are considered potentially druggable due to emergent properties or structures that are associated with druggability (e.g. kinases, nuclear receptors).
        </p>
        <h4>Genes</h4>
        <p><b>Gene</b> is used to refer to an expressed protein product associated with an existing HGNC gene. Nearly all DGIdb gene records are associated with an HGNC symbol and concept identifiers.
        </p>
        <h4>Drugs</h4>
        <p><b>Drug</b> is used to refer to a compound or small molecule that can target or interact with an expressed gene protein product.
        </p>
        </>
    );
};