-- We aren't currently able to get everything we need from the CKB API endpoint;
-- These queries make it easier to transfer data from a previous DGIdb database by
-- producing outputs that, when exported as CSVs, can be ingested by a file importer.
-- Note that to use this script, you'd have to change the home directory path.

-- gene claim
COPY (SELECT gc.name, gc.nomenclature
FROM gene_claims gc
         LEFT JOIN sources s on gc.source_id = s.id
WHERE source_db_name = 'CKB-CORE')
TO '/Users/jss009/.local/share/wags_tails/ckb_core/ckb_core_gene_claims.csv' WITH CSV DELIMITER ',' HEADER;

-- gene claim aliases
COPY (SELECT name, alias, gca.nomenclature
FROM gene_claim_aliases gca
LEFT JOIN gene_claims gc on gca.gene_claim_id = gc.id
LEFT JOIN sources s on gc.source_id = s.id
WHERE s.source_db_name = 'CKB-CORE')
TO '/Users/jss009/.local/share/wags_tails/ckb_core/ckb_core_gene_claim_aliases.csv' WITH CSV DELIMITER ',' HEADER;

-- drug claim
COPY (SELECT dc.name, dc.nomenclature
FROM drug_claims dc
LEFT JOIN sources s on dc.source_id = s.id
WHERE s.source_db_name = 'CKB-CORE')
TO '/Users/jss009/.local/share/wags_tails/ckb_core/ckb_core_drug_claims.csv' WITH CSV DELIMITER ',' HEADER;

-- interaction claim
COPY (SELECT dc.name, gc.name
FROM interaction_claims ic
LEFT JOIN sources s on ic.source_id = s.id
LEFT JOIN drug_claims dc on ic.drug_claim_id = dc.id
LEFT JOIN gene_claims gc on ic.gene_claim_id = gc.id
WHERE s.source_db_name = 'CKB-CORE')
TO '/Users/jss009/.local/share/wags_tails/ckb_core/ckb_core_interaction_claims.csv' WITH CSV DELIMITER ',' HEADER;

-- interaction claim attributes
COPY (SELECT ica.name, ica.value, dc.name, gc.name
FROM interaction_claims ic
         LEFT JOIN sources s on ic.source_id = s.id
         LEFT JOIN drug_claims dc on ic.drug_claim_id = dc.id
         LEFT JOIN gene_claims gc on ic.gene_claim_id = gc.id
         RIGHT JOIN interaction_claim_attributes ica on ic.id = ica.interaction_claim_id
WHERE s.source_db_name = 'CKB-CORE')
TO '/Users/jss009/.local/share/wags_tails/ckb_core/ckb_core_interaction_claim_attributes.csv' WITH CSV DELIMITER ',' HEADER;

-- interaction claim links
COPY (SELECT icl.link_text, icl.link_url, dc.name, gc.name
FROM interaction_claims ic
         LEFT JOIN sources s on ic.source_id = s.id
         LEFT JOIN drug_claims dc on ic.drug_claim_id = dc.id
         LEFT JOIN gene_claims gc on ic.gene_claim_id = gc.id
         RIGHT JOIN interaction_claim_links icl on ic.id = icl.interaction_claim_id
WHERE s.source_db_name = 'CKB-CORE')
TO '/Users/jss009/.local/share/wags_tails/ckb_core/ckb_core_interaction_claim_links.csv' WITH CSV DELIMITER ',' HEADER;

-- interaction claim publications
COPY (SELECT p.pmid, p.citation, dc.name, gc.name
FROM interaction_claims_publications icp
    LEFT JOIN publications p ON icp.publication_id = p.id
    LEFT JOIN interaction_claims ic ON ic.id = icp.interaction_claim_id
    LEFT JOIN sources s on s.id = ic.source_id
    LEFT JOIN drug_claims dc ON dc.id = ic.drug_claim_id
    LEFT JOIN gene_claims gc ON gc.id = ic.gene_claim_id
WHERE s.source_db_name = 'CKB-CORE')
TO '/Users/jss009/.local/share/wags_tails/ckb_core/ckb_core_interaction_claim_publications.csv' WITH CSV DELIMITER ',' HEADER;
