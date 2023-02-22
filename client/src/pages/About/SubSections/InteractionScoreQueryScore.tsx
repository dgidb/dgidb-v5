export const InteractionScoreQueryScore = () => {

  return(
    <div className="interaction-score-query-score-section-container doc-section">
      <p>
        DGIdb calculcates two types of scores when searching for an interaction, the Query Score and the Interaction Score.
      </p>
      <p>
       The Query Score is relative to the search set and considers the overlap of interactions in the result set. For interaction searches using a gene list, the Query Score depends on the evidence scores (publications and sources), the number of genes from the search set that interact with the given drug, and the ratio of average known gene partners for all drugs to the known partners for the given drug (see figure below). Similarly, for interaction searches using a drug list, the Query Score depends on the evidence scores (publications and sources), the number of drugs from the search set that interact with the given gene, and the ratio of average known drug partners for all genes to the known partners for the given gene. In effect, this means that genes and drugs with many overlapping interactions in the search set will rank more highly, with the caveat that drugs or genes involved in many interactions, in general, will have lowered scores. Note that as sources are updated and additional interaction claims are added to DGIdb, the Query Score for a particular search set may change.
      </p>

      <p>
        The Interaction Score is a static score, meaning that it doesn't changed from search to search. It is based on the evidence of an interaction. It mirrors the Query Score except that it removes the dependency on queried gene or drug sets and only uses evidence scores, the ratio of average known gene partners for all drugs to the known partners for the given drug, and the ratio of average known drug partners for all genes to the known partners for the given gene (see figure below). Since the Interaction Score depends on numbers of drug and gene partners, as well as number of supporting publications and sources, as sources are updated and new claims are added the Interaction Score may change over time as well. However, between updates, the Interaction Score will remain static, regardless of the search set. The Interaction Score is also displayed on individual interaction's page as well as the API.
      </p>

      <img width='800px' src='/images/interaction_score.png'/>

      <p> Overview of DGIdb’s new Query Scores and interaction scores. A) Schematic of how each of the scores is calculated within DGIdb. Gene and drug queries both return a Query Score that is dependent on the search terms. Each interaction has an Interaction Score that is calculated independently of other search terms. B) Example of a Query Score changing based on the terms searched. In the first panel, only MEK1 and MEK2 were searched and the Interaction Score for the interaction between MEK1 and Cobimetinib was 9.76. In the second panel, BRAF and KRAS were added to the search query. These both interact with Cobimetinib and thus raise the Query Score. C) Example of Interaction Score. The panel on the left shows the interaction between ZEB1 and Salinomycin. This is the only interaction for Salinomycin and thus it has a high Interaction Score. The panel on the right shows the interaction between ZEB1 and Doxorubicin. Doxorubicin is involved in 87 interactions within DGIdb and thus has a much lower Interaction Score. Note that over time, as sources are updated and new claims are added, both Query Scores and Interaction Scores may change.</p>
    </div>
  )
}