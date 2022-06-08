-- We aren't currently able to get everything we need from the OncoKB API endpoint;
-- These queries make it easier to transfer data from the DGIdb v4 database by
-- producing outputs that, when exported as CSVs, can be ingested by a file importer.

-- gene claim
SELECT gc.name, gc.nomenclature
FROM gene_claims gc
         LEFT JOIN sources s on gc.source_id = s.id
WHERE source_db_name = 'OncoKB';

-- gene claim aliases
SELECT name, alias, gca.nomenclature
FROM gene_claim_aliases gca
         LEFT JOIN gene_claims gc on gca.gene_claim_id = gc.id
         LEFT JOIN sources s on gc.source_id = s.id
WHERE s.source_db_name = 'OncoKB';

-- drug claim
SELECT dc.name, dc.nomenclature
FROM drug_claims dc
         LEFT JOIN sources s on dc.source_id = s.id
WHERE s.source_db_name = 'OncoKB';

-- interaction claim
SELECT dc.name, gc.name
FROM interaction_claims ic
         LEFT JOIN sources s on ic.source_id = s.id
         LEFT JOIN drug_claims dc on ic.drug_claim_id = dc.id
         LEFT JOIN gene_claims gc on ic.gene_claim_id = gc.id
WHERE s.source_db_name = 'OncoKB';

-- interaction claim attributes
SELECT ica.name, ica.value, dc.name, gc.name
FROM interaction_claims ic
         LEFT JOIN sources s on ic.source_id = s.id
         LEFT JOIN drug_claims dc on ic.drug_claim_id = dc.id
         LEFT JOIN gene_claims gc on ic.gene_claim_id = gc.id
         RIGHT JOIN interaction_claim_attributes ica on ic.id = ica.interaction_claim_id
WHERE s.source_db_name = 'OncoKB';

-- interaction claim links
SELECT icl.link_text, icl.link_url, dc.name, gc.name
FROM interaction_claims ic
         LEFT JOIN sources s on ic.source_id = s.id
         LEFT JOIN drug_claims dc on ic.drug_claim_id = dc.id
         LEFT JOIN gene_claims gc on ic.gene_claim_id = gc.id
         RIGHT JOIN interaction_claim_links icl on ic.id = icl.interaction_claim_id
WHERE s.source_db_name = 'OncoKB';
