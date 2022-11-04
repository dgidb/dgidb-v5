module Genome
  class DataImporter
    module License
      UNKNOWN_UNAVAILABLE = 'Unknown; data is no longer publicly available from site'.freeze
      UNKNOWN = 'Unknown'.freeze
      CC_BY_NC_3_0 = 'Creative Commons Attribution-NonCommercial 3.0 (BY-NC)'.freeze
      CC_BY_SA_3_0 = 'Creative Commons Attribution-ShareAlike 3.0 Unported (CC BY-SA 3.0)'.freeze
      CC_BY_SA_4_0 = 'Create Commons Attribution-ShareAlike 4.0 International License'.freeze
      PUBLIC_DOMAIN = 'Public domain'.freeze
      CUSTOM_NON_COMMERCIAL = 'Custom Non-Commercial'.freeze
    end

    module DrugNomenclature
      PRIMARY_NAME = 'Primary Name'.freeze

      DEVELOPMENT_NAME = 'Development Name'.freeze
      ALIAS = 'ALIAS'.freeze
      TRADE_NAME = 'Trade Name'.freeze
      GENERIC_NAME = 'Generic Name'.freeze
      XREF = 'Xref'.freeze

      RXNORM_ID = 'RxNorm ID'.freeze
      HEMONC_ID = 'HemOnc ID'.freeze
      DRUGSATFDA_ID = 'Drugs@FDA ID'.freeze
      CHEMIDPLUS_ID = 'ChemIDplus ID'.freeze
      WIKIDATA_ID = 'Wikidata ID'.freeze
      CONCEPT_ID = 'Concept ID'.freeze
      GTOP_LIGAND_NAME = 'GuideToPharmacology Ligand Name'.freeze
      DRUGBANK_ID = 'DrugBank ID'.freeze
      PHARMGKB_ID = 'PharmGKB ID'.freeze
      CHEMBL_ID = 'ChEMBL ID'.freeze
      PUBCHEM_COMPOUND_ID = 'PubChem Compound ID'.freeze
      PUBCHEM_SUBSTANCE_ID = 'PubChem Substance ID'.freeze
      NCIT_ID = 'NCIt ID'.freeze
      PFAM_ID = 'PFAM ID'.freeze
      TTD_ID = 'TTD ID'.freeze
    end

    module DrugAttributeName
      NOTES = 'Notes'.freeze
      DRUG_CLASS = 'Drug Class'.freeze
      DRUG_SUBCLASS = 'Drug Subclass'.freeze
      CLINICAL_TRIAL_ID = 'Clinical Trial ID'.freeze
      INDICATION = 'Indication'.freeze
      DEVELOPER = 'Developer'.freeze
      APPROVAL_YEAR = 'Year of Approval'.freeze
      CLEARITY_LINK = 'Link to Clearity Drug Class Schematic'.freeze
      SPECIES_NAME = 'Name of Ligand Species'.freeze
      GENE_SYMBOL = 'Gene Symbol for Endogenous Peptides'.freeze
    end

    module GeneNomenclature
      SYMBOL = 'Gene Symbol'.freeze
      NAME = 'Gene Name'.freeze
      SYNONYM = 'Gene Synonym'.freeze
      DESCRIPTION = 'Description'.freeze
      PREVIOUS_SYMBOL = 'Previous Symbol'.freeze

      NCBI_NAME = 'NCBI Gene Name'.freeze
      NCBI_ID = 'NCBI Gene ID'.freeze
      REFSEQ_ACC = 'RefSeq Accession'.freeze
      ENSEMBL_ID = 'Ensembl Gene ID'.freeze
      HGNC_ID = 'HGNC ID'.freeze
      UNIPROTKB_ID = 'UniProtKB ID'.freeze
      UNIPROTKB_NAME = 'UniProtKB Entry Name'.freeze
      UNIPROTKB_PROTEIN_NAME = 'UniProtKB Protein Name'.freeze
      UNIPROTKB_GENE_NAME = 'UniProtKB Gene Name'.freeze
      CIVIC_ID = 'CIViC ID'.freeze
      TTD_ID = 'TTD ID'.freeze
      PHARMGKB_ID = 'PharmGKB ID'.freeze
      CHEMBL_ID = 'ChEMBL ID'.freeze
      GTOP_ID = 'GuideToPharmacology ID'.freeze
      GENBANK_ID = 'GenBank Protein ID'.freeze
      CONCEPT_ID = 'Concept ID'.freeze
    end

    module GeneAttributeName
      GTOP_FAMILY_ID = 'GuideToPharmacology Family ID'.freeze
      GTOP_FAMILY_NAME = 'GuideToPharmacology Family Name'.freeze
      INTERPRO_ACC_ID = 'InterPro Accession ID'.freeze
      INTERPRO_NAME_SHORT = 'InterPro Short Name'.freeze
      INTERPRO_TYPE = 'InterPro Type'.freeze
      UNIPROTKB_EV = 'UniProtKB Evidence'.freeze
      UNIPROTKB_STATUS = 'UniProtKB Status'.freeze
      CITES = 'Counted Citations from 1950-2009'.freeze
      QUERY = 'Initial Gene Query'.freeze
      TARGET_EVENT = 'Reported Genome Event Targeted'.freeze
      CLASS = 'Target Class'.freeze
      MAIN_CLASS = 'Target Main Class'.freeze
      SUBCLASS = 'Target Subclass'.freeze
      HELIX_CT = 'Transmembrane Helix Count'.freeze
      ENSEMBL_TYPE = 'Ensembl Biotype'.freeze
      NCBI_TYPE = 'NCBI Gene Type'.freeze
      HGNC_TYPE = 'HGNC Locus Type'.freeze
    end

    module InteractionAttributeName
      ALTERATION = 'Alteration'.freeze
      APPROVAL_STATUS = 'Approval Status'.freeze
      CLINICAL_TRIAL_ID = 'Clinical Trial ID'.freeze
      CLINICAL_TRIAL_NAME = 'Clinical Trial Name'.freeze
      COMBINATION = 'Combination Therapy'.freeze
      CONTEXT = 'Interaction Context'.freeze
      BINDING_SITE = 'Specific Binding Site'.freeze
      ASSAY = 'Assay Details'.freeze
      DETAILS = 'Details'.freeze
      ENDOGENOUS_DRUG = 'Endogenous Drug'.freeze
      DIRECT = 'Direct Interaction'.freeze
      EV_TYPE = 'Evidence Type'.freeze
      FUSION_PROTEIN = 'Fusion Protein'.freeze
      INDICATION = 'Indication'.freeze
      CANCER_TYPE = 'Cancer Type'.freeze
      MOA = 'Mechanism of Action'.freeze
      NOVEL = 'Novel Drug Target'.freeze
      PATHWAY = 'Pathway'.freeze
      RESPONSE = 'Response Type'.freeze
      VARIANT_EFFECT = 'Variant Effect'.freeze
    end
  end
end
