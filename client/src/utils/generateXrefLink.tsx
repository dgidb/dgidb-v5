import { Link } from '@mui/material';
import { ResultTypes } from 'types/types';

const drugPatterns: [RegExp, string][] = [
  [/^PUBCHEM.COMPOUND:(.+)/, 'https://pubchem.ncbi.nlm.nih.gov/compound/'],
  [/^CHEMBL:(.+)/i, 'https://www.ebi.ac.uk/chembl/compound_report_card/'],
  [
    /^NCIT:(.+)/i,
    'https://ncithesaurus.nci.nih.gov/ncitbrowser/ConceptReport.jsp?dictionary=NCI_Thesaurus&ns=ncit&code=',
  ],
  [/^DRUGBANK:(.+)/i, 'https://go.drugbank.com/drugs/'],
  [/^WIKIDATA:(.+)/i, 'https://www.wikidata.org/wiki/'],
  [/^CHEMIDPLUS:(.+)/i, 'https://pubchem.ncbi.nlm.nih.gov/#query='],
  [
    /^IUPHAR.LIGAND:(.+)/i,
    'https://www.guidetopharmacology.org/GRAC/LigandDisplayForward?ligandId=',
  ],
  [
    /^RXCUI:(.+)/i,
    'https://mor.nlm.nih.gov/RxNav/search?searchBy=RXCUI&searchTerm=',
  ],
];

const genePatterns: [RegExp, string][] = [
  [/^NCBIGENE:(.+)/i, 'https://www.ncbi.nlm.nih.gov/gene/?term='],
  [
    /^ENSEMBL:(.+)/i,
    'https://ensembl.org/Homo_sapiens/Gene/Summary?db=core;g=',
  ],
  [
    /^HGNC:(.+)/i,
    'https://www.genenames.org/data/gene-symbol-report/#!/hgnc_id/HGNC:',
  ],
  [/^UCSC:(.+)/, 'https://genome.cse.ucsc.edu/cgi-bin/hgGene?hgg_gene='],
  [
    /^CCDS:(.+)/,
    'https://www.ncbi.nlm.nih.gov/projects/CCDS/CcdsBrowse.cgi?REQUEST=ALLFIELDS&ORGANISM=0&BUILDS=CURRENTBUILDS&DATA=',
  ],
  [/^COSMIC:(.+)/, 'https://cancer.sanger.ac.uk/cosmic/gene/analysis?ln='],
  [
    /^ORPHANET:(.+)/,
    'https://www.orpha.net/consor/cgi-bin/OC_Exp.php?lng=en&Expert=',
  ],
  [/^UNIPROT:(.+)/, 'https://www.uniprot.org/uniprotkb/'],
  [/^OMIM:(.+)/, 'https://www.omim.org/entry/'],
  [/^REFSEQ:(.+)/, 'https://www.ncbi.nlm.nih.gov/nuccore/'],
  [
    /^VEGA:(.+)/,
    'vega.archive.ensembl.org/Homo_sapiens/Gene/Summary?db=core;g=',
  ],
  [/^ENA\.EMBL:(.+)/, 'https://www.ebi.ac.uk/ena/browser/view/'],
  [/^CIVIC\.GID:(.+)/, 'https://civicdb.org/genes/'],
  [/^CHEMBL:(.+)/, 'https://www.ebi.ac.uk/chembl/target_report_card/'],
  [
    /^IUPHAR\.RECEPTOR:(.+)/,
    'https://www.guidetopharmacology.org/GRAC/ObjectDisplayForward?objectId=',
  ],
];

export const generateXrefLink = (
  xref: string,
  itemType: ResultTypes,
  linkClassName: string = ''
) => {
  if (!xref.includes(':')) {
    return <>{xref}</>;
  }
  let url = '';
  let patterns: [RegExp, string][] | null;
  if (itemType === ResultTypes.Gene) {
    patterns = genePatterns;
  } else {
    patterns = drugPatterns;
  }
  patterns.forEach(([pattern, url_base]: [RegExp, string]) => {
    const match = xref.match(pattern);
    if (match) {
      url = url_base + match[1];
    }
  });
  if (url.length === 0) {
    return <>{xref}</>;
  } else {
    return (
      <Link href={url} className={linkClassName} target="_blank">
        {xref}
      </Link>
    );
  }
};
