# frozen_string_literal: true
module Genome
  class DataImporter
    module License
      UNKNOWN_UNAVAILABLE = 'Unknown; data is no longer publicly available from site'
      UNKNOWN = 'Unknown'
      CUSTOM = 'Custom'
      CC0_1_0 = 'Creative Commons CC0 1.0 Universal (CC0 1.0) Public Domain Dedication'
      CC_ATT_4_0 = 'Creative Commons Attribution 4.0 International'
      CC_BY_3_0 = 'Creative Commons Attribution 3.0 Unported (CC BY 3.0)'
      CC_BY_4_0 = 'Creative Commons Attribution 4.0 International (CC BY 4.0)'
      CC_BY_NC_3_0 = 'Creative Commons Attribution-NonCommercial 3.0 (BY-NC)'
      CC_BY_NC_4_0 = 'Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0)'
      CC_BY_NC_SA_3_0 = 'Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported (CC BY-NC-SA 3.0)'
      CC_BY_NC_SA_4_0 = 'Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International (CC BY-NC-SA 4.0)'
      CC_BY_SA_3_0 = 'Creative Commons Attribution-ShareAlike 3.0 Unported (CC BY-SA 3.0)'
      CC_BY_SA_4_0 = 'Create Commons Attribution-ShareAlike 4.0 International License'
      PUBLIC_DOMAIN = 'Public domain'
      CUSTOM_NON_COMMERCIAL = 'Custom Non-Commercial'
    end

    module DrugNomenclature
      PRIMARY_NAME = 'Primary Name'

      DEVELOPMENT_NAME = 'Development Name'
      ALIAS = 'ALIAS'
      TRADE_NAME = 'Trade Name'
      GENERIC_NAME = 'Generic Name'
      XREF = 'Xref'

      RXNORM_ID = 'RxNorm ID'
      HEMONC_ID = 'HemOnc ID'
      DRUGSATFDA_ID = 'Drugs@FDA ID'
      CHEMIDPLUS_ID = 'ChemIDplus ID'
      WIKIDATA_ID = 'Wikidata ID'
      CONCEPT_ID = 'Concept ID'
      GTOP_LIGAND_NAME = 'GuideToPharmacology Ligand Name'
      DRUGBANK_ID = 'DrugBank ID'
      PHARMGKB_ID = 'PharmGKB ID'
      CHEMBL_ID = 'ChEMBL ID'
      PUBCHEM_COMPOUND_ID = 'PubChem Compound ID'
      PUBCHEM_SUBSTANCE_ID = 'PubChem Substance ID'
      NCIT_ID = 'NCIt ID'
      PFAM_ID = 'PFAM ID'
      TTD_ID = 'TTD ID'
    end

    module DrugAttributeName
      NOTES = 'Notes'
      DRUG_CLASS = 'Drug Class'
      DRUG_SUBCLASS = 'Drug Subclass'
      CLINICAL_TRIAL_ID = 'Clinical Trial ID'
      INDICATION = 'Indication'
      DEVELOPER = 'Developer'
      APPROVAL_YEAR = 'Year of Approval'
      CLEARITY_LINK = 'Link to Clearity Drug Class Schematic'
      SPECIES_NAME = 'Name of Ligand Species'
      GENE_SYMBOL = 'Gene Symbol for Endogenous Peptides'
    end

    module GeneNomenclature
      SYMBOL = 'Gene Symbol'
      NAME = 'Gene Name'
      SYNONYM = 'Gene Synonym'
      DESCRIPTION = 'Description'
      PREVIOUS_SYMBOL = 'Previous Symbol'

      NCBI_NAME = 'NCBI Gene Name'
      NCBI_ID = 'NCBI Gene ID'
      REFSEQ_ACC = 'RefSeq Accession'
      ENSEMBL_ID = 'Ensembl Gene ID'
      HGNC_ID = 'HGNC ID'
      UNIPROTKB_ID = 'UniProtKB ID'
      UNIPROTKB_NAME = 'UniProtKB Entry Name'
      UNIPROTKB_PROTEIN_NAME = 'UniProtKB Protein Name'
      UNIPROTKB_GENE_NAME = 'UniProtKB Gene Name'
      CIVIC_ID = 'CIViC ID'
      TTD_ID = 'TTD ID'
      PHARMGKB_ID = 'PharmGKB ID'
      CHEMBL_ID = 'ChEMBL ID'
      GTOP_ID = 'GuideToPharmacology ID'
      GENBANK_ID = 'GenBank Protein ID'
      CONCEPT_ID = 'Concept ID'
    end

    module GeneAttributeName
      GTOP_FAMILY_ID = 'GuideToPharmacology Family ID'
      GTOP_FAMILY_NAME = 'GuideToPharmacology Family Name'
      INTERPRO_ACC_ID = 'InterPro Accession ID'
      INTERPRO_NAME_SHORT = 'InterPro Short Name'
      INTERPRO_TYPE = 'InterPro Type'
      UNIPROTKB_EV = 'UniProtKB Evidence'
      UNIPROTKB_STATUS = 'UniProtKB Status'
      CITES = 'Counted Citations from 1950-2009'
      QUERY = 'Initial Gene Query'
      TARGET_EVENT = 'Reported Genome Event Targeted'
      CLASS = 'Target Class'
      MAIN_CLASS = 'Target Main Class'
      SUBCLASS = 'Target Subclass'
      HELIX_CT = 'Transmembrane Helix Count'
      ENSEMBL_TYPE = 'Ensembl Biotype'
      NCBI_TYPE = 'NCBI Gene Type'
      HGNC_TYPE = 'HGNC Locus Type'
    end

    module InteractionAttributeName
      ALTERATION = 'Alteration'
      APPROVAL_STATUS = 'Approval Status'
      CLINICAL_TRIAL_ID = 'Clinical Trial ID'
      CLINICAL_TRIAL_NAME = 'Clinical Trial Name'
      COMBINATION = 'Combination Therapy'
      CONTEXT = 'Interaction Context'
      BINDING_SITE = 'Specific Binding Site'
      ASSAY = 'Assay Details'
      DETAILS = 'Details'
      ENDOGENOUS_DRUG = 'Endogenous Drug'
      DIRECT = 'Direct Interaction'
      EV_TYPE = 'Evidence Type'
      FUSION_PROTEIN = 'Fusion Protein'
      INDICATION = 'Indication'
      CANCER_TYPE = 'Cancer Type'
      MOA = 'Mechanism of Action'
      NOVEL = 'Novel Drug Target'
      PATHWAY = 'Pathway'
      RESPONSE = 'Response Type'
      VARIANT_EFFECT = 'Variant Effect'
    end
  end
end
