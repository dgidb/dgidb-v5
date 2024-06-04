import { Box, Link } from '@mui/material';

export const Overview = () => {
  return (
    <Box className="about-section-container doc-section">
      <p className="about-sub-header">
        Mining the Druggable Genome for Personalized Medicine
      </p>

      <p className="about-citation">
        <Link
          href="https://academic.oup.com/nar/article/52/D1/D1227/7416371?login=true"
          target="_blank"
          rel="noreferrer"
        >
          DGIdb 5.0: rebuilding the drug-gene interaction database for precision
          medicine and drug discovery platforms
        </Link>{' '}
        Cannon M, Stevenson J, Stahl K, Basu R, Coffman A, Kiwala S, McMichael
        JF, Kuzma K, Morrisey D, Cotto KC, Mardis ER, Griffith OL, Griffith M,
        Wagner AH. Nucleic Acids Research. 2024 Jan 5; doi:
        https://doi.org/10.1093/nar/gkad1040. PMID: 37953380.
      </p>

      <p>
        In the era of clinical sequencing and personalized medicine,
        investigators are frequently presented with lists of mutated or
        otherwise altered genes implicated in disease for a specific patient or
        cohort. Numerous resources exist to help form hypotheses about how such
        genomic events might be targeted therapeutically. However, utilizing
        these resources typically involves tedious manual review of literature,
        clinical trial records, and knowledgebases. Few currently exist which
        collect and curate these resources and provide a simple interface for
        searching lists of genes against the existing compendia of known or
        potential drug-gene interactions. The drug-gene interaction database
        (DGIdb) attempts to address this challenge. Using a combination of
        expert curation and text-mining, drug-gene interactions have been mined
        from{' '}
        <Link href="https://www.drugbank.com/" target="_blank" rel="noreferrer">
          DrugBank
        </Link>
        ,{' '}
        <Link href="https://www.pharmgkb.org/" target="_blank" rel="noreferrer">
          PharmGKB
        </Link>
        ,{' '}
        <Link
          href="https://www.ebi.ac.uk/chembl/"
          target="_blank"
          rel="noreferrer"
        >
          ChEMBL
        </Link>
        ,{' '}
        <Link
          href="https://drugtargetcommons.fimm.fi/"
          target="_blank"
          rel="noreferrer"
        >
          Drug Target Commons
        </Link>
        , and <Link href="/browse/sources">others</Link>. Genes have also been
        categorized as potentially druggable according to membership in selected
        pathways, molecular functions and gene families from the{' '}
        <Link href="http://geneontology.org/" target="_blank" rel="noreferrer">
          Gene Ontology
        </Link>
        , the{' '}
        <Link
          href="https://www.proteinatlas.org/"
          target="_blank"
          rel="noreferrer"
        >
          Human Protein Atlas
        </Link>
        ,{' '}
        <Link
          href="https://druggablegenome.net/"
          target="_blank"
          rel="noreferrer"
        >
          IDG
        </Link>
        , "druggable genome" lists from{' '}
        <Link
          href="https://pubmed.ncbi.nlm.nih.gov/12209152/"
          target="_blank"
          rel="noreferrer"
        >
          Hopkins and Groom (2002)
        </Link>{' '}
        and{' '}
        <Link
          href="https://pubmed.ncbi.nlm.nih.gov/16376820/"
          target="_blank"
          rel="noreferrer"
        >
          Russ and Lampel (2005)
        </Link>
        , and others. Drug and gene grouping is provided by the VICC{' '}
        <Link
          href="https://github.com/cancervariants/gene-normalization"
          target="_blank"
        >
          Gene
        </Link>{' '}
        and{' '}
        <Link
          href="https://github.com/cancervariants/therapy-normalization"
          target="_blank"
        >
          Therapy
        </Link>{' '}
        Normalizer services. DGIdb contains over 10,000 genes and 20,000 drugs
        involved in nearly 70,000 drug-gene interactions or belonging to one of 43
        potentially druggable gene categories. Users can enter a list of genes
        to retrieve all known or potentially druggable genes in that list.
        Results can be filtered by source, interaction type, or gene category.
        DGIdb is built on Ruby on Rails and PostgreSQL with a flexible
        relational database schema to accommodate metadata from various sources.
      </p>

      <p>
        The druggable genome can be defined as the genes or gene products that
        are known or predicted to interact with drugs, ideally with a
        therapeutic benefit to the patient. Such genes are of particular
        interest to large-scale cancer profiling efforts such as TCGA, ICGC and
        others that identify lists of potential cancer driver genes from
        high-throughput sequence and other genome-wide data. In cancer therapy,
        the increasing number of targeted drugs--those designed to inactivate
        proteins carrying activating amino acid changes as determined by
        mutational analyses--make more compelling the need for a searchable
        database of drug-gene interactions. A similar paradigm exists in the
        research of other human diseases. Thus, a commonly-asked question in
        such projects is whether potential driver genes are targeted by any
        known drugs or belong to any putatively druggable gene categories. Along
        these lines, recent high profile cancer marker papers have presented
        "druggable gene" analyses. These analyses attempt to prioritize genes
        for further study, functional experiments, and ultimately to help guide
        the design of clinical trials. Unfortunately, there remains a large
        knowledge gap between clinical domain experts and genomic researchers.
        The former are intimately familiar with the disease-specific pathways
        and targeted therapies being used in the field. However, the latter
        possess the technical expertise to detect the known and potentially
        novel driver events hidden in the molecular data of disease samples
        under study. There is a critical need for tools that bridge this gap to
        help both basic and clinical researchers to prioritize and interpret the
        results of genome-wide studies in the context of gene function, clinical
        phenotypes, treatment decisions and patient outcomes.
      </p>

      <p>
        Existing resources for querying the druggable genome are problematic.
        Data are often not made publicly accessible. Searching across multiple
        sources is difficult due to the plethora of gene and drug identifier
        systems. Some interfaces permit single gene at a time searches but have
        no mechanism for searching a list of genes. Others are only available
        for manual review and have no search interface at all. Web interfaces
        generally are neither user-friendly nor available in convenient formats
        for systematic analysis. Some data sources are available only as PDF
        documents or are difficult to obtain, such as the widely used but now
        unsupported 'Hopkins and Groom' and 'Russ and Lampel' druggable genome
        lists. Even when made accessible, filtering options are needed so that
        searches can be made with different levels of stringency. This is
        necessary because of the inherent trade-off between comprehensiveness
        and quality in such efforts. Some databases have large numbers of lower
        quality interactions while others have focused on very careful curation
        of a smaller number. The optimal resource to use depends on the goals of
        the researcher. Clinical researchers may wish to restrict themselves
        only to carefully curated interactions involving known and approved
        agents. Basic researchers on the other hand may be willing to evaluate
        experimental therapies or interactions with lower levels of support. To
        address these challenges we have developed the Drug Gene Interaction
        Database (DGIdb). Our goal was to create a user-friendly search tool and
        comprehensive database of genes that have the potential to be druggable,
        with a particular focus on cancer. We hope to capture and prioritize
        genes that are known to be targeted by existing drugs, especially
        targeted drugs rather than broad chemotherapeutics. Our motivation was
        to make accessible much of the information already available through
        databases and manuscript supplementary materials. By cross-mapping
        identifiers and creating a simple interface to these disparate sources
        we provide a single destination for druggable genome information against
        which gene lists can be searched and prioritized for functional
        characterization.
      </p>

      <p>
        DGIdb attempts to organize the druggable genome under two main classes.
        The first class includes genes with known drug interactions. Such
        drug-gene interactions are useful for the case where a researcher has a
        list of candidate genes predicted to be activated in disease, and wishes
        to identify drugs that might inhibit or otherwise modulate those genes.
        The second class includes genes that are 'potentially' druggable
        according to their membership in gene categories associated with
        druggability (e.g., kinases). Membership in these categories is useful
        for prioritizing a list of genes according to their potential for drug
        development. The former are established interactions between genes and
        drugs, based largely on literature mining and obtained from existing
        publicly available reviews and databases. These can come from either
        gene- or drug-centric database models and are not limited by functional
        category or drug modality. The latter represent genes that have
        properties making them suitable for drug targeting but may not currently
        have a drug targeting them. There are various ways to define this class
        of potentially 'druggable' genes. We drew from several existing efforts
        and local domain knowledge to define categories that are most relevant
        to druggability. These categories tend to be biased towards genes that
        are amenable to targeting by small molecules such as kinases, ion
        channels, etc. For both classes of druggable genes, sources were
        manually curated and semi-automatically imported. The database can be
        accessed programmatically or through a web-based interface or API at
        dgidb.org. Search results can be filtered and ranked in multiple ways
        and are easily exported for further analysis or visualization. We
        believe DGIdb represents a powerful resource for hypothesis generation.
        DGIdb may also facilitate prioritization of gene-level events for review
        by clinical experts and ultimately aid in treatment decision-making.
      </p>

      <p>
        Identifying clinically relevant genes using DGIdb has a number of
        limitations that should be acknowledged. DGIdb provides links between
        genes and their known or potential drug associations. It does not
        currently provide any information regarding the druggability of specific
        mutations, nor does it guarantee that any given drug-gene association
        represents an appropriate therapeutic intervention. DGIdb's concept of a
        drug-gene interaction or membership in a potentially druggable category
        is inclusive and largely driven by the underlying data sources and
        publications. It includes 43 potentially druggable categories and least
        30 interaction types as defined by source datasets. These include
        inhibitors, activators, cofactors, ligands, vaccines, and in many cases,
        interactions of unknown type. Wherever possible we provide filtering by
        source, interaction type, and gene category to allow the user to quickly
        disregard possibly spurious candidates.
      </p>
    </Box>
  );
};
