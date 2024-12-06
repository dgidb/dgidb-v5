-- It's a little tricky to grab data from the final DOCM dump;
-- instead, these queries help us produce dumps from our last extraction in DGIdb

-- gene claim
SELECT gc.name, gc.nomenclature
FROM gene_claims gc
         LEFT JOIN sources s on gc.source_id = s.id
WHERE source_db_name = 'DoCM';

-- drug claim
SELECT dc.name, dc.nomenclature
FROM drug_claims dc
         LEFT JOIN sources s on dc.source_id = s.id
WHERE s.source_db_name = 'DoCM';

-- interaction claim
SELECT dc.name, gc.name
FROM interaction_claims ic
         LEFT JOIN sources s on ic.source_id = s.id
         LEFT JOIN drug_claims dc on ic.drug_claim_id = dc.id
         LEFT JOIN gene_claims gc on ic.gene_claim_id = gc.id
WHERE s.source_db_name = 'DoCM';

-- interaction claim attributes
SELECT ica.name, ica.value, dc.name, gc.name
FROM interaction_claims ic
         LEFT JOIN sources s on ic.source_id = s.id
         LEFT JOIN drug_claims dc on ic.drug_claim_id = dc.id
         LEFT JOIN gene_claims gc on ic.gene_claim_id = gc.id
         RIGHT JOIN interaction_claim_attributes ica on ic.id = ica.interaction_claim_id
WHERE s.source_db_name = 'DoCM';

-- interaction claim publications
SELECT p.pmid, p.citation, dc.name, gc.name
FROM interaction_claims ic
         LEFT JOIN sources s on ic.source_id = s.id
         LEFT JOIN drug_claims dc on ic.drug_claim_id = dc.id
         LEFT JOIN gene_claims gc on ic.gene_claim_id = gc.id
         RIGHT JOIN interaction_claims_publications icp ON icp.interaction_claim_id = ic.id
         LEFT JOIN publications p ON p.id = icp.publication_id
WHERE s.source_db_name = 'DoCM';
