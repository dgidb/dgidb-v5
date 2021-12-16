Frequently Asked Questions
==========================

**What is the goal of DGIdb?**

The goal of DGIdb is to help you annotate your genes of interest with respect to known drug-gene interactions and potential druggability.

**How do I cite DGIdb?**
Please cite our most recent paper on DGIdb, which can be found on the `Publications <publications.rst>`_ page.

**Is DGIdb open source and open access?**
The source code for DGIdb is open-source and made available under the MIT license. The license is distributed with the source code `DGIdb license <https://github.com/dgidb/dgidb-v5/blob/main/LICENSE>`_. The data used in DGIdb is all open access and where possible made available as raw data dumps in the `downloads <https://dgidb.org/downloads>`_ section.

**What types of gene names/symbols should I use as input?**
The short answer is that you should ideally use official HUGO gene symbols as reported by Entrez Gene. We have developed a gene name grouping strategy that attempts to aggregate synonyms for each gene. We start with the official name and alternate names of each Entrez Gene and update with additional names from each data source. You should get reasonable results with known synonyms, Ensembl Ids, Uniprot Ids, etc. If you enter a gene name that is ambiguous or unmatched this will be noted in the results. You should attempt to find a more official name for such genes and update your gene list.

**How are genes defined in DGIdb?**
The gene summary page shows the primary name, alternate names and metadata for each gene locus as provided by each source of data imported into DGIdb. Genes in DGIdb are first defined by Entrez but mapped together with gene records from other sources by Entrez ID, Ensembl ID, UniProt ID or alternate names/synonyms in that order of preference.

**How are drugs defined in DGIdb?**
The drug summary page shows the primary drug name, alternates names, and metadata for each gene as provided by each source of the data imported into DGIdb. Drugs are first defined by ChEMBL but mapped together with drug records from other sources.

**How are the gene and drug filters defined in DGIdb?**
When searching by genes, filters for drug interactions currently include Approved drugs, Antineoplastic drugs, and Immunotherapies. Regulatory approval status is extracted from ChEMBL. Anti-neoplastic drugs are defined by inclusion in an anti-neoplastic drug–gene interaction source (e.g. My Cancer Genome), or as a drug with an anti-neoplastic attribute from its constituent source. Immunotherapy drugs are defined as any drug with an attribute of ‘immunosuppressive agent’, ‘immunomodulatory agent’ or ‘immunostimulant’.

When searching by drugs, filters for gene interactions currently include Clinically Actionable genes, genes included in the Druggable Genome definition and Drug Resistant genes. Clinically Actionable genes are genes that constitute the DGIdb ‘clinically actionable’ gene category, and by definition is used to inform clinical action (e.g. the Foundation One diagnostic gene panels). Similarly, druggable genome genes are genes listed in the DGIdb ‘druggable genome’ gene category. Drug resistance genes are defined by the Gene Ontology as genes that confer drug resistance or susceptibility (GO identifier 0042493), and are maintained in the DGIdb through the ‘drug resistance’ gene category.

**Where can I find the source code for DGIdb?**
The code for DGIdb is available at `github <https://github.com/genome/dgidb-v5>`_.

**I have a source of druggable genes or drug-gene interactions that I would like to add to DGIdb. How do I do that?**
This is an open source project and you could therefore create your own instance with your own data. However, if you want that source, chances are that we do too. `Contact us <mailto:help@dgidb.org>`_ and we will be happy to consider adding your source for you.

**What is the meaning of 'Gene Categories' in DGIdb?**
Gene categories in DGIdb refers to a set of genes belonging to a group that is deemed to be `potentially druggable <http://en.wikipedia.org/wiki/Druggability>`_. For example, kinases are generally deemed to have high potential value for development of targeted drugs. For more details on the sources of druggable gene category definitions, refer to the `sources <https://dgidb.org/sources>`_ and `background reading <about.rst>`_.

**What is an 'Interaction Type' and "Interaction Type Directionality"?**
An interaction type describes the nature of the association between a particular gene and drug. For example, TTD reports the drug-gene interaction, SUNITINIB-FLT3. The interaction type is reported as 'inhibitor'. Interaction type, as used in DGIdb, is very broad. Dozens of interaction types are currently defined. Many interaction types describe the mechanism of action between a small molecule and a protein. However, other broader types of 'interaction' might also be used. e.g. Gene X mediates 'resistance' or 'sensitivity' to drug Y.

Interaction types can be loosely grouped into Activating interaction types and Inhibiting interaction types. Activating interactions are those where the drug increases the biological activity or expression of a gene target while Inhibiting interactions are those where the drug decreases the biological activity or expression of a gene target. A full list of interaction types and their definition can be found on the `Interaction Types & Directionalities <interaction_types.rst>`_ page.

**What is the "Interaction Score" and the "Query Score"?**
Please see the `Interaction Score & Query Score <interaction_score.rst>`_ page for a detailed explanation of these terms.

**What is the difference between a drug-gene interaction and druggable gene category?**
A drug-gene interaction is a known interaction (e.g. inhibition) between a known drug compound (e.g. lapatinib) and a target gene (e.g. EGFR). A druggable gene category is a grouping of genes that are thought to be potentially druggable by various methods of prediction. For example, the 'rule-of-five' analysis described by Hopkins and Groom in 2002 defined lists of genes that were most likely to be successfully targeted by small molecule inhibitors. Genes in these categories are *potentially druggable* and may or may not have existing drugs that target them. On the other hand, all of the genes from the drug-gene interaction sources are targeted by specific known compounds.

**What is the difference between a cancer-specific source and a disease-agnostic source?**
Cancer-specific sources are sources that only contain information pertaining to cancers while disease-agnostic do not limit their data in regards to the disease. While cancer related searches are a major use-case for DGIdb and cancer-specific sources are well-represented among all sources, DGIdb is not a cancer-specific resource and is intended to be utilized for non-cancer related research as well. In the interaction and category searches the source list in the Source Databases dropdown is grouped by cancer-specific and disease-agnostic sources and users may select or deselect all entries in each group by clicking on the respective header in the dropdown.

**How is this application different from DrugBank, TTD or other databases?**
There are many differences. DGIdb is limited to human genes only. DrugBank and TTD are databases that catalogue drugs and store detailed information about those drugs and the genes they target. DGIdb aggregates many such databases into a common framework. DGIdb adds considerable functionality for efficiently searching a list of input genes against these sources. DGIdb integrates both known drug-gene interactions and potentially druggable gene data. DGIdb allows the user to refine their query to certain gene families, types of interactions, etc. DGIdb is open source and available in a format that would allow you to create your own instance. DGIdb incorporates sources of drug-gene interaction data that were previously only available in inaccessible formats (e.g. tables in a PDF document). DGIdb is meant to be used in combination with the original sources of raw data. Wherever possible we link out to those original sources.

**I found a gene in a category that does not really belong there or a drug-gene interaction that appears false. Should I report it?**
We are working on updates to the interface that would allows us to readily capture this kind of information directly from users. In the meantime please feel free to report it to us. The quality of our data is only as good as the sources of raw data. Throughout the results you will be able to see if multiple independent sources report the same findings. Using the number of sources, query score, or interaction score as filters may help you disqualify some spurious entries and have increased confidence in others.

**Some druggable gene categories seem very inclusive. For example, are there really nearly 2000 human kinases?**
This is by design. Druggable gene categories are aggregated from multiple sources, some of which are predictive in nature. Predictions based on sequence similarity may result in some false positives. More stringent lists can be obtained by limiting to a particular source(s) (e.g. dGene only) or by requiring that multiple sources agree.

**How is DGIdb implemented?**
The web interface uses Ruby on Rails and Twitter bootstrap. The backend is a PostgreSQL database. The importers that process data from each source and populate this database are written in Ruby with occasional forays into Python.

**How is versioning handled in DGIdb?**
This question has several answers. The footer of every page in the web interface contains a version stamp that describes versions for various components. The interface code itself is tracked on `GitHub <https://github.com/dgidb/dgidb-v5>`. The source stamp contains a SHA-1 tag that corresponds to the version of code being run. Each input source of data we import may have its own version number associated with it. If so, we maintain this info and display it on the `source summary view <https://dgidb.org/sources>`_. If an input source does not have concept of versioning, we note the date of import instead. Source versions are included in TSV export results for each drug-gene interaction found.

**What does the version stamp at the foot of each view mean?**
It is currently generated whenever we perform a rake task to create a new data snapshot for DGIdb. The version number corresponds to a tag in git and eventually the debian package we use to push a development version of DGIdb to the publicly facing server. The SHA-1 is the commit id from when the snapshot was generated, as is the datestamp.

**I think I have identified a bug in the DGIdb code. What should I do?**
Please let us know. You may contact us by `email <mailto:help@dgidb.org>`. If your question is more complicated, please ask it publicly on `BioStars <http://www.biostars.org/>`_. The code for DGIdb is open-source, and if you have a GitHub account you may post your question directly to the GitHub `issue tracker <https://github.com/dgidb/dgidb-v5/issues>`_ for our developers to review. If you are the curious/ambitious type, feel free to investigate a solution and let us know what you find.

