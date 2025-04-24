import React from 'react';
import './TypesAndDirectionality.scss';
import { TypesTable } from 'components/About/InteractionClaimTypes/TypesTable';
import { NoteBox } from 'components/About/NoteBox/NoteBox'

export const AboutTypesAndDirectionality: React.FC = () => {
    return (
        <>
        <h1>Interaction Types</h1>
        <h4>What is an interaction type?</h4>
        <p>An interaction type describes the nature of the association between a particular drug and gene. While some reported interaction types may be broad, many describe the mechanism of action between a small molecule and a protein. For example, TTD reports the drug-gene interaction SUNITINIB-FLT3 as an “inhibitor” interaction type.
        </p>

        <h4>What is interaction directionality?</h4>
        <p>Interaction types are loosely grouped as “activating” or “inhibiting” based upon the effects of their mechanism of action. Activating interactions are those where the drug increases the biological activity or expression of a gene target. Inhibiting interactions are those where the drug decreases the biological activity or expression of a gene target. 
        </p>

        <h4>Interaction types and directionality in DGIdb</h4>
        <p>A full table of interaction types and directionality has been assembled for these terms with citations to support these definitions. We encourage users of DGIdb to use these definitions as a starting point and review interactions of interest from their primary sources. If you have any questions or comments regarding these definitions or the use of DGIdb, please contact us!
        </p>
        <br/>
        <NoteBox>
        <TypesTable />
        </NoteBox>
        </>
    );
};