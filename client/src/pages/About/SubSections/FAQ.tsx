import { Link } from '@mui/material';

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
          Please cite our most recent paper on DGIdb, which can be found in the{' '}
          <a href="#publications">Publications</a> section.
        </div>
      </div>
      <div className="faq-item">
        <div className="faq-question">
          Is DGIdb open source and open access?
        </div>
        <div className="faq-answer">
          The source code for DGIdb is open-source and made available under the
          MIT license. The license is distributed with the source code (
          <a href="https://github.com/dgidb/dgidb-v5/blob/main/LICENSE">
            DGIdb license
          </a>
          ). The data used in DGIdb is all open access and where possible made
          available as raw data dumps in the <a href="/downloads">downloads</a>{' '}
          section.
        </div>
      </div>
      <div className="faq-item">
        <div className="faq-question">
          What types of gene names/symbols should I use as input?
        </div>
        <div className="faq-answer">
          Where possible, you are advised to use up-to-date{' '}
          <Link href="https://www.genenames.org/" target="_blank">
            HGNC symbols
          </Link>
          . Nearly all DGIdb gene records are associated with an HGNC symbol and
          concept identifer. Most records are also well-annotated with
          alternative names and identifiers as well as previously-used symbols,
          but these terms may be more ambiguous, or result in conflicting
          matches. In this case, possible matches will be listed under the
          "Ambiguous or Unmatched" tab in the search results page.
        </div>
      </div>
      <div className="faq-item">
        <div className="faq-question">
          How are drugs and genes defined in DGIdb?
        </div>
        <div className="faq-answer">
          Drug and gene records in DGIdb represent aggregations of individual
          source drug and gene claims, grouped together by the{' '}
          <Link
            href="https://github.com/cancervariants/gene-normalization"
            target="_blank"
          >
            Gene
          </Link>{' '}
          and
          <Link
            href="https://github.com/cancervariants/therapy-normalization"
            target="_blank"
          >
            Therapy
          </Link>{' '}
          Normalization services. For both, normalized groups are first defined
          by combining records from central, well-curated sources (e.g. Ensembl
          and NCBI Gene for genes, and RxNorm and ChEMBL for drugs) based on
          cross-references. See the normalization services' documentation for
          more information.
        </div>
      </div>
      <div className="faq-item">
        <div className="faq-question">
          Where can I find the source code for DGIdb?
        </div>
        <div className="faq-answer">
          The code for DGIdb is available at{' '}
          <a href="https://github.com/dgidb/dgidb-v5">GitHub</a>.
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
          category definitions, refer to the{' '}
          <a href="/browse/sources">sources</a>.
        </div>
      </div>
      <div className="faq-item">
        <div className="faq-question">
          What is an "Interaction Type" and "Interaction Type Directionality"?
        </div>
        <div className="faq-answer">
          An interaction type describes the nature of the association between a
          particular gene and drug. For example, TTD reports the drug-gene
          interaction, SUNITINIB-FLT3. The interaction type is reported as
          'inhibitor'. Interaction type, as used in DGIdb, is very broad. Dozens
          of interaction types are currently defined. Many interaction types
          describe the mechanism of action between a small molecule and a
          protein. However, other broader types of 'interaction' might also be
          used. e.g. Gene X mediates 'resistance' or 'sensitivity' to drug Y.
          <br></br>
          <br></br>A full list of interaction types and their definition can be
          found in the{' '}
          <a href="#interaction-types">Interaction Types & Directionalities</a>{' '}
          section. Interaction types can be loosely grouped into Activating
          interaction types and Inhibiting interaction types. Activating
          interactions are those where the drug increases the biological
          activity or expression of a gene target while Inhibiting interactions
          are those where the drug decreases the biological activity or
          expression of a gene target. To see which interaction types fall under
          which directionality check out the list of interaction types on the{' '}
          <a href="#interaction-types">Interaction Types & Directionalities</a>{' '}
          section.
        </div>
      </div>
      <div className="faq-item">
        <div className="faq-question">What is the "Interaction Score"?</div>
        <p className="faq-answer">
          Please see the <a href="#interaction-scores">Interaction Score</a>{' '}
          section for a detailed explanation of these terms.
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
          categories are potentially druggable and may or may not have existing
          drugs that target them. On the other hand, all of the genes from the
          drug-gene interaction sources are targeted by specific known
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
        <p className="faq-answer">
          This is by design. Druggable gene categories are aggregated from
          multiple sources, some of which are predictive in nature. Predictions
          based on sequence similarity may result in some false positives. More
          stringent lists can be obtained by limiting to a particular source(s)
          (e.g. dGene only) or by requiring that multiple sources agree.
        </p>
      </div>
      <div className="faq-item">
        <div className="faq-question">How is DGIdb implemented?</div>
        <p className="faq-answer">
          The web interface is a React frontend served from a Ruby on Rails
          backend using a GraphQL API. Data is deposited in a PostgreSQL
          database. The importers that process data from each source and
          populate this database are written in Ruby.
        </p>
      </div>
      <div className="faq-item">
        <div className="faq-question">How is versioning handled in DGIdb?</div>
        <p className="faq-answer">
          This question has several answers. The footer of every page in the web
          interface contains a version stamp that describes versions for various
          components. The interface code itself is meticulously tracked on{' '}
          <a href="https://github.com/dgidb/dgidb-v5">GitHub</a>. The source
          stamp contains a SHA-1 tag that corresponds to the version of code
          being run. Each input source of data we import may have its own
          version number associated with it. If so, we maintain this info and
          display it on the source summary view. If an input source does not
          have concept of versioning, we note the date of import instead. Source
          versions are included in TSV export results for each drug-gene
          interaction found.
        </p>
      </div>
      <div className="faq-item">
        <div className="faq-question">
          What does the version stamp at the foot of each view mean?
        </div>
        <p className="faq-answer">
          It is currently generated whenever we perform a Rake task to create a
          new data snapshot for DGIdb. The version number corresponds to a tag
          in Git and eventually the debian package we use to push a development
          version of DGIdb to the publicly facing server. The SHA-1 is the
          commit id from when the snapshot was generated, as is the datestamp.
        </p>
      </div>
      <div className="faq-item">
        <div className="faq-question">
          I think I have identified a bug in the DGIdb code. What should I do?
        </div>
        <p className="faq-answer">
          Please let us know. You may contact us by{' '}
          <a href="mailto:help@dgidb.org">email</a>. If your question is more
          complicated, please ask it publicly on the GitHub{' '}
          <a href="https://github.com/dgidb/dgidb-v5/issues">issue tracker</a>{' '}
          for our developers to review. If you are the curious/ambitious type,
          feel free to investigate a solution and let us know what you find.
        </p>
      </div>
    </div>
  );
};
