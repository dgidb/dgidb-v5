import TabPanel from "components/Shared/TabPanel/TabPanel";
import { DrugSummary } from "../DrugSummary";
import AmbiguousTermsSummary from "components/Shared/AmbiguousTermsSummary/AmbiguousTermsSummary";
import { Tab, Tabs } from "@mui/material";
import "./DrugSearchResults.scss";

interface DrugSearchResultsProps {
  value: number;
  handleChange:
    | ((event: React.SyntheticEvent<Element, Event>, value: any) => void)
    | undefined;
}

export const DrugSearchResults: React.FC<DrugSearchResultsProps> = ({
  value,
  handleChange,
}) => {
  return (
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
        <DrugSummary conceptIds={[]} />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <AmbiguousTermsSummary resultType={"drug"} />
      </TabPanel>
    </>
  );
};
