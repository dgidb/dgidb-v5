import TabPanel from "components/Shared/TabPanel/TabPanel";
import { GeneSummary } from "../GeneSummary";
import AmbiguousTermsSummary from "components/Shared/AmbiguousTermsSummary/AmbiguousTermsSummary";
import { Tab, Tabs } from "@mui/material";

interface GeneSearchResultProps {
  value: number;
  handleChange: any; // TODO
}

export const GeneSearchResult: React.FC<GeneSearchResultProps> = ({
  value,
  handleChange,
}) => (
  <>
    <Tabs
      value={value}
      onChange={handleChange}
      textColor="secondary"
      indicatorColor="secondary"
    >
      <Tab label="Unique Matches" />
      <Tab label="Ambiguous or Unmatched" />
    </Tabs>
    <TabPanel value={value} index={0}>
      <GeneSummary conceptIds={[]} />
    </TabPanel>
    <TabPanel value={value} index={1}>
      <AmbiguousTermsSummary resultType={"gene"} />
    </TabPanel>
  </>
);
