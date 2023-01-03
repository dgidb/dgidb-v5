// hooks/dependencies
import {
  useGetDruggableSources,
  useGetGeneSources,
  useGetDrugSources,
  useGetInteractionSources,
} from 'hooks/queries/useGetDruggableSources';

// styles
import './BrowseSources.scss';

export const BrowseSources = () => {

  const {data: geneData } = useGetGeneSources("GENE");
  const {data: drugData } = useGetDrugSources("DRUG");
  const {data: interactionData } = useGetInteractionSources("INTERACTION");
  const {data: potentiallyDruggableData } = useGetDruggableSources("POTENTIALLY_DRUGGABLE");

  let geneSources = geneData?.sources?.nodes;
  let drugSources = drugData?.sources?.nodes;
  let interactionSources = interactionData?.sources?.nodes;
  let potentiallyDruggableSources = potentiallyDruggableData?.sources?.nodes;

  const sectionsMap = [
    {
      heading: "Gene Sources",
      sources: geneSources,
    },
    {
      heading: "Drug Sources",
      sources: drugSources,
    },
    {
      heading: "Interaction Sources",
      sources: interactionSources,
    },
    {
      heading: "Potentially Druggable Sources",
      sources: potentiallyDruggableSources,
    },
  ]

  const getCard = (src: any) => {
    return (
      <div className="source-item-card">
        <div className="source-item-name">{src.sourceDbName}</div>
        <div hidden={!(src.geneClaimsCount && src.geneClaimsCount > 0)}><b>Gene Claims Count:</b> {src.geneClaimsCount}</div>
        <div hidden={!(src.geneClaimsInGroupsCount && src.geneClaimsInGroupsCount > 0)}><b>Gene Claims In Group:</b> {src.geneClaimsInGroupsCount}</div>
        <div hidden={!(src.drugClaimsCount && src.drugClaimsCount > 0)}><b>Drug Claims Count:</b> {src.drugClaimsCount}</div>
        <div hidden={!(src.drugClaimsInGroupsCount && src.drugClaimsInGroupsCount > 0)}><b>Drug Claims In Group:</b> {src.drugClaimsInGroupsCount}</div>
        <div><b>License: </b><a href={src.licenseLink} target="_blank">{src.license}</a></div>
        <div><b>Full Citation:</b> {src.citation}</div>
      </div>
    )
  }

  // gene section, drug section, interaction, potentially druggable

  return (
    <div className="sources-page-container">
      {
        sectionsMap.map((section: any) => {
          return (
            <>
              <div className="source-type-header"><h2><b>{section.heading}</b></h2></div>
              <div className="sources-grid">
                {
                  section.sources?.map((src: any) => {
                    return getCard(src)
                  })
                }
              </div>
            </>
          )
        })
      }
    </div>
  )
}