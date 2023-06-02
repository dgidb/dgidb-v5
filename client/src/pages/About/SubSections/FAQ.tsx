export const FAQ = () => {
  return (
    <div className="faq-section-container doc-section">
      <div className="faq-item">
        <div className="faq-question">What is the goal of DGIdb? </div>
        <div className="faq-answer">
          The goal of DGIdb is to help you annotate your genes of interest with
          respect to known drug-gene interactions and potential druggability.
        </div>
      </div>
      <div className="faq-item">
        <div className="faq-question">How do I cite DGIdb?</div>
        <div className="faq-answer">
          Please cite our most recent paper on DGIdb, which can be found on the
          Publications page.
        </div>
      </div>
      <div className="faq-item">
        <div className="faq-question">
          Is DGIdb open source and open access?
        </div>
        <div className="faq-answer">
          The source code for DGIdb is open-source and made available under the
          MIT license. The license is distributed with the source code (DGIdb
          license). The data used in DGIdb is all open access and where possible
          made available as raw data dumps in the downloads section.
        </div>
      </div>
      <div className="faq-item">
        <div className="faq-question">
          What types of gene names/symbols should I use as input?
        </div>
        <div className="faq-answer">
          The short answer is that you should ideally use official HUGO gene
          symbols as reported by Entrez Gene. We have developed a gene name
          grouping strategy that attempts to aggregate synonyms for each gene.
          We start with the official name and alternate names of each Entrez
          Gene and update with additional names from each data source. You
          should get reasonable results with known synonyms, Ensembl Ids,
          Uniprot Ids, etc. If you enter a gene name that is ambiguous or
          unmatched this will be noted in the results. You should attempt to
          find a more official name for such genes and update your gene list.
        </div>
      </div>
      <div className="faq-item">
        <div className="faq-question">How are genes defined in DGIdb?</div>
        <div className="faq-answer">
          The gene summary page shows the primary name, alternate names and
          metadata for each gene locus as provided by each source of data
          imported into DGIdb. Genes in DGIdb are first defined by Entrez but
          mapped together with gene records from other sources by Entrez ID,
          Ensembl ID, UniProt ID or alternate names/synonyms in that order of
          preference.
        </div>
      </div>
      <div className="faq-item">
        <div className="faq-question">How are drugs defined in DGIdb?</div>
        <div className="faq-answer">
          The drug summary page shows the primary drug name, alternates names,
          and metadata for each gene as provided by each source of the data
          imported into DGIdb. Drugs are first defined by ChEMBL but mapped
          together with drug records from other sources.
        </div>
      </div>
      <div className="faq-item">
        <div className="faq-question">
          How are the gene and drug filters defined in DGIdb?
        </div>
        <div className="faq-answer">
          When searching by genes, filters for drug interactions currently
          include Approved drugs, Antineoplastic drugs, and Immunotherapies.
          Regulatory approval status is extracted from ChEMBL. Anti-neoplastic
          drugs are defined by inclusion in an anti-neoplastic drug–gene
          interaction source (e.g. My Cancer Genome), or as a drug with an
          anti-neoplastic attribute from its constituent source. Immunotherapy
          drugs are defined as any drug with an attribute of ‘immunosuppressive
          agent’, ‘immunomodulatory agent’ or ‘immunostimulant’. When searching
          by drugs, filters for gene interactions currently include Clinically
          Actionable genes, genes included in the Druggable Genome definition
          and Drug Resistant genes. Clinically Actionable genes are genes that
          constitute the DGIdb ‘clinically actionable’ gene category, and by
          definition is used to inform clinical action (e.g. the Foundation One
          diagnostic gene panels). Similarly, druggable genome genes are genes
          listed in the DGIdb ‘druggable genome’ gene category. Drug resistance
          genes are defined by the Gene Ontology as genes that confer drug
          resistance or susceptibility (GO identifier 0042493), and are
          maintained in the DGIdb through the ‘drug resistance’ gene category.
        </div>
      </div>
      <div className="faq-item">
        <div className="faq-question">
          Where can I find the source code for DGIdb?
        </div>
        <div className="faq-answer">
          The code for DGIdb is available at github.
        </div>
      </div>
      <div className="faq-item">
        <div className="faq-question">
          I have a source of druggable genes or drug-gene interactions that I
          would like to add to DGIdb. How do I do that?
        </div>
        <div className="faq-answer">
          This is an open source project and you could therefore create your own
          instance with your own data. However, if you want that source, chances
          are that we do too. Contact us and we will be happy to consider adding
          your source for you.
        </div>
      </div>
      <div className="faq-item">
        <div className="faq-question">
          What is the meaning of 'Gene Categories' in DGIdb?
        </div>
        <div className="faq-answer">
          Gene categories in DGIdb refers to a set of genes belonging to a group
          that is deemed to be potentially druggable. For example, kinases are
          generally deemed to have high potential value for development of
          targeted drugs. For more details on the sources of druggable gene
          category definitions, refer to the sources and background reading.
        </div>
      </div>
      <div className="faq-item">
        <div className="faq-question">
          What is an 'Interaction Type' and "Interaction Type Directionality"?
        </div>
        <div className="faq-answer"></div>
      </div>
      <div className="faq-item">
        <div className="faq-question">
          What is the "Interaction Score" and the "Query Score"?
        </div>
        <p className="faq-answer">
          Please see the Interaction Score and Query Score page for a detailed
          explanation of these terms.
        </p>
      </div>
      <div className="faq-item">
        <div className="faq-question">
          What is the difference between a drug-gene interaction and druggable
          gene category?
        </div>
        <p className="faq-answer">
          A drug-gene interaction is a known interaction (e.g. inhibition)
          between a known drug compound (e.g. lapatinib) and a target gene (e.g.
          EGFR). A druggable gene category is a grouping of genes that are
          thought to be potentially druggable by various methods of prediction.
          For example, the 'rule-of-five' analysis described by Hopkins and
          Groom in 2002 defined lists of genes that were most likely to be
          successfully targeted by small molecule inhibitors. Genes in these
          categories are *potentially druggable* and may or may not have
          existing drugs that target them. On the other hand, all of the genes
          from the drug-gene interaction sources are targeted by specific known
          compounds.
        </p>
      </div>
      <div className="faq-item">
        <div className="faq-question">
          What is the difference between a cancer-specific source and a
          disease-agnostic source?
        </div>
        <p className="faq-answer">
          Cancer-specific sources are sources that only contain information
          pertaining to cancers while disease-agnostic do not limit their data
          in regards to the disease. While cancer related searches are a major
          use-case for DGIdb and cancer-specific sources are well-represented
          among all sources, DGIdb is not a cancer-specific resource and is
          intended to be utilized for non-cancer related research as well. In
          the interaction and category searches the source list in the Source
          Databases dropdown is grouped by cancer-specific and disease-agnostic
          sources and users may select or deselect all entries in each group by
          clicking on the respective header in the dropdown.
        </p>
      </div>
      <div className="faq-item">
        <div className="faq-question">
          How is this application different from DrugBank, TTD or other
          databases?
        </div>
        <p className="faq-answer">
          There are many differences. DGIdb is limited to human genes only.
          DrugBank and TTD are databases that catalogue drugs and store detailed
          information about those drugs and the genes they target. DGIdb
          aggregates many such databases into a common framework. DGIdb adds
          considerable functionality for efficiently searching a list of input
          genes against these sources. DGIdb integrates both known drug-gene
          interactions and potentially druggable gene data. DGIdb allows the
          user to refine their query to certain gene families, types of
          interactions, etc. DGIdb is open source and available in a format that
          would allow you to create your own instance. DGIdb incorporates
          sources of drug-gene interaction data that were previously only
          available in inaccessible formats (e.g. tables in a PDF document).
          DGIdb is meant to be used in combination with the original sources of
          raw data. Wherever possible we link out to those original sources.
        </p>
      </div>
      <div className="faq-item">
        <div className="faq-question">
          I found a gene in a category that does not really belong there or a
          drug-gene interaction that appears false. Should I report it?
        </div>
        <p className="faq-answer">
          We are working on updates to the interface that would allows us to
          readily capture this kind of information directly from users. In the
          meantime please feel free to report it to us. The quality of our data
          is only as good as the sources of raw data. Throughout the results you
          will be able to see if multiple independent sources report the same
          findings. Using the number of sources, query score, or interaction
          score as filters may help you disqualify some spurious entries and
          have increased confidence in others.
        </p>
      </div>
      <div className="faq-item">
        <div className="faq-question">
          Some druggable gene categories seem very inclusive. For example, are
          there really nearly 2000 human kinases?
        </div>
        <p className="faq-answer"></p>
      </div>
      <div className="faq-item">
        <div className="faq-question"></div>
        <p className="faq-answer"></p>
      </div>
      <div className="faq-item">
        <div className="faq-question"></div>
        <p className="faq-answer"></p>
      </div>
      <div className="faq-item">
        <div className="faq-question"></div>
        <p className="faq-answer"></p>
      </div>
    </div>
  );
};
