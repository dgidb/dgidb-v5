export enum ExampleResponse {
  all_interactions = `
  {
    "_meta": {
      "current_page": 1,
      "per_page": 25,
      "total_pages": 1878,
      "total_count": 46929,
      "links": {
        "next": "https://dgidb.org/api/v2/interactions?count=25&page=2",
        "previous": null
      }
    },
    "records": [
      {
        "id": "001098f2-1b60-4c87-b3dd-245eb04ede43",
        "gene_name": "SLC12A1",
        "entrez_id": 6557,
        "drug_name": "METHYCLOTHIAZIDE",
        "concept_id": "chembl:CHEMBL1577",
        "publications": [
          11752352,
          17139284,
          17016423
        ],
        "interaction_types": [
          "inhibitor"
        ],
        "interaction_direction": [
          "inhibitory"
        ],
        "sources": [
          "TdgClinicalTrial",
          "TEND",
          "TTD"
        ],
        "score": 9.09
      },
      ...
    ]
  }`,
  interaction_details = `
  {
    "id": "001098f2-1b60-4c87-b3dd-245eb04ede43",
    "gene_name": "SLC12A1",
    "entrez_id": 6557,
    "drug_name": "METHYCLOTHIAZIDE",
    "concept_id": "chembl:CHEMBL1577",
    "publications": [
      17016423,
      17139284,
      11752352
    ],
    "interaction_types": [
      "inhibitor"
    ],
    "interaction_direction": [
      "inhibitory"
    ],
    "sources": [
      "TdgClinicalTrial",
      "TEND",
      "TTD"
    ],
    "score": 9.09,
    "attributes": [
      {
        "name": "Trial Name",
        "value": "-",
        "sources": [
          "TdgClinicalTrial"
        ]
      },
      {
        "name": "Novel drug target",
        "value": "Established target",
        "sources": [
          "TdgClinicalTrial"
        ]
      }
    ],
    "interaction_claims": [
      {
        "source": "TEND",
        "drug": "METHYCLOTHIAZIDE",
        "gene": "Q13621",
        "interaction_types": [],
        "attributes": [],
        "publications": [],
        "source_links": [
          {
            "url": "https://www.nature.com/articles/nrd3478/tables/1",
            "text": "Trends in the exploitation of novel drug targets, Table 1"
          }
        ]
      },
      {
        "source": "TdgClinicalTrial",
        "drug": "METHYCLOTHIAZIDE",
        "gene": "Q13621",
        "interaction_types": [],
        "attributes": [
          {
            "name": "Trial Name",
            "value": "-"
          },
          {
            "name": "Novel drug target",
            "value": "Established target"
          }
        ],
        "publications": [],
        "source_links": [
          {
            "url": "https://www.annualreviews.org/doi/10.1146/annurev-pharmtox-011613-135943",
            "text": "The druggable genome: Evaluation of drug targets in clinical trials suggests major shifts in molecular class and indication. Rask-Andersen M, Masuram S, Schioth HB. Annu Rev Pharmacol Toxicol. 2014;54:9-26. doi: 10.1146/annurev-pharmtox-011613-135943. PMID: 24016212"
          }
        ]
      },
      {
        "source": "TTD",
        "drug": "Methyclothiazide",
        "gene": "Solute carrier family 12 member 1",
        "interaction_types": [],
        "attributes": [],
        "publications": [],
        "source_links": [
          {
            "url": "http://idrblab.net/ttd/data/target/details/T93878",
            "text": "TTD Target Information"
          }
        ]
      }
    ]
  }
  `,
  all_drugs = `
  {
    "_meta": {
      "current_page": 1,
      "per_page": 25,
      "total_pages": 578,
      "total_count": 14449,
      "links": {
        "next": "https://dgidb.org/api/v2/drugs?count=25&page=2",
        "previous": null
      }
    },
    "records": [
      {
        "name": "ELLAGIC ACID",
        "concept_id": "chembl:CHEMBL6246",
        "approved": false,
        "immunotherapy": false,
        "anti_neoplastic": false,
        "alias": [
          "NSC-407286",
          "BENZOARIC ACID",
          "NSC-656272",
          "ELLAGIC ACID"
        ]
      },
      ...
    ]
  }`,
  drug_details = `
  {
    "name": "TESAMORELIN",
    "concept_id": "chembl:CHEMBL1237026",
    "approved": true,
    "immunotherapy": false,
    "anti_neoplastic": false,
    "alias": [
      "TH9507",
      "TH-9507",
      "TESAMORELIN",
      "TESAMORELIN ACETATE",
      "N-(TRANS-3-HEXENOYL)-HUMAN GROWTH HORMONE RELEASING FACTOR (1-44) ACETATE",
      "EGRIFTA",
      "drugbank:08869",
      "pubchem.compound:16137828",
      "chemidplus:218949-48-5",
      "chembl:CHEMBL1237026",
      "rxcui:1044584"
    ],
    "pmids": [
      22298602
    ],
    "attributes": [
      {
        "name": "Drug Class",
        "value": "antilipodystrophy agents",
        "sources": [
          "TEND"
        ]
      },
      {
        "name": "Year of Approval",
        "value": "2010",
        "sources": [
          "TEND"
        ]
      },
      {
        "name": "FDA Approval",
        "value": "approved",
        "sources": [
          "TdgClinicalTrial"
        ]
      },
      {
        "name": "Drug Class",
        "value": "peptide",
        "sources": [
          "TdgClinicalTrial"
        ]
      },
      {
        "name": "Drug Indications",
        "value": "for treatment of HIV-associated lipodystrophy",
        "sources": [
          "TdgClinicalTrial"
        ]
      }
    ],
    "drug_claims": [
      {
        "source": "ChemblDrugs",
        "name": "chembl:CHEMBL1237026",
        "primary_name": "TESAMORELIN",
        "aliases": [],
        "attributes": [],
        "publications": []
      },
      {
        "source": "TEND",
        "name": "TESAMORELIN",
        "primary_name": "TESAMORELIN",
        "aliases": [
          "TESAMORELIN"
        ],
        "attributes": [
          {
            "name": "Drug Class",
            "value": "antilipodystrophy agents"
          },
          {
            "name": "Year of Approval",
            "value": "2010"
          }
        ],
        "publications": []
      },
      {
        "source": "TdgClinicalTrial",
        "name": "TESAMORELIN",
        "primary_name": "TESAMORELIN",
        "aliases": [],
        "attributes": [
          {
            "name": "Drug Class",
            "value": "peptide"
          },
          {
            "name": "Drug Indications",
            "value": "for treatment of HIV-associated lipodystrophy"
          },
          {
            "name": "FDA Approval",
            "value": "approved"
          }
        ],
        "publications": []
      },
      {
        "source": "GuideToPharmacology",
        "name": "178103540",
        "primary_name": "TESAMORELIN",
        "aliases": [
          "TESAMORELIN"
        ],
        "attributes": [],
        "publications": []
      },
      {
        "source": "TTD",
        "name": "Tesamorelin",
        "primary_name": "Tesamorelin",
        "aliases": [
          "D0UL9R"
        ],
        "attributes": [],
        "publications": []
      }
    ]
  }`,
  all_genes = `
  {
    "_meta": {
      "current_page": 1,
      "per_page": 25,
      "total_pages": 1644,
      "total_count": 41100,
      "links": {
        "next": "http://dgidb.org/api/v2/genes?count=25&page=2",
        "previous": null
      }
    },
    "records": [
      {
        "name":"A1BG",
        "long_name":"alpha-1-B glycoprotein",
        "entrez_id":1,
        "aliases":[
          "A1B",
          "ABG",
          "GAB",
          "HYST2477",
          "ENSG00000121410"
        ]
      },
      ...
    ]
  }`,
  gene_details = `
  {
    "name":"APOC4",
    "long_name":"apolipoprotein C4",
    "entrez_id":346,
    "aliases":[
      "APO-CIV",
      "APOC-IV",
      "ENSG00000224916",
      "P55056",
      "apolipoprotein C-IV","346",
      "ENSG00000267467",
      "P21731",
      "TBXA2R",
      "TP receptor"
    ],
    "pmids":[
      1386885,
      10634944,
      2530338,
      2968449,
      1387312,
      1833018,
      1825698,
      16604093,
      2975605,
      1830308,
      1434130,
      8437108,
      3008368,
      11454901,
      2527074,
      8242228,
      9871769,
      2743082
    ],
    "attributes":[
      {
        "name":"Gene Biotype",
        "value":"PROTEIN_CODING",
        "sources":[
          "Ensembl"
        ]
      }
    ],
    "categories":[
      "TRANSPORTER"
    ],
    "gene_claims":[
      {
        "source":"GuideToPharmacologyInteractions",
        "name":"346",
        "aliases":[
          "P21731",
          "TBXA2R",
          "TP receptor"
        ],
        "attributes":[],
        "publications":[
          10634944,
          8242228,
          2748606,
          8859002,
          1434130,
          10537280,
          8882612,
          3594077,
          1386885,
          2530338,
          2968449,
          1387312,
          1833018,
          16604093,
          2975605,
          1830308,
          8437108,
          3008368,
          11454901,
          2527074,
          9871769,
          2743082,
          1825698
        ]
      },
      {
        "source":"Ensembl",
        "name":"ENSG00000224916",
        "aliases":[
          "ENSG00000224916",
          "APOC4"
        ],
        "attributes":[
          {
            "name":"Gene Biotype",
            "value":"PROTEIN_CODING"
          }
        ],
        "publications":[]
      },
      {
        "source":"GO",
        "name":"APOC4",
        "aliases":[
          "P55056"
        ],
        "attributes":[],
        "publications":[]
      }
    ]
  }`,
  interaction_types = `["activator", "inhibitor", "unknown"]`,
  interaction_sources = `["DrugBank","PharmGKB","TALC","TEND","TTD"]`,
  gene_categories = `["KINASE", "DNA REPAIR", "TUMOR SUPPRESSOR"]`,
  source_trust_levels = `["Expert curated", "Non-curated"]`,
  genes_in_category = `["SNRK","BCR","FKBP1A","TAB2","DGKE","PHKA1","PRKCH"]`,
}