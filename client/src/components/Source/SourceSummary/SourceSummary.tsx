import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Grid,
  Link,
  Paper,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Tabs,
  Typography,
} from '@mui/material';
import { useGetSourceInfo } from 'hooks/queries/useGetSourceDescriptions';
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import TabPanel from 'components/Shared/TabPanel/TabPanel';
import { SourceDrugClaims } from '../SourceDrugClaims/SourceDrugClaims';

export const SourceSummary: React.FC = () => {
  const [claimTab, setClaimTab] = useState<number>(0);
  const sourceName = useParams().name as string;
  const { data, isLoading, isError } = useGetSourceInfo(sourceName);
  const sourceData = data?.source;
  const sourceTypes = sourceData?.sourceTypes?.map(
    (sourceType: any) => sourceType.type
  );
  const isInteractionType = sourceTypes?.includes('interaction')
  const isDrugType = sourceTypes?.includes('interaction') || sourceTypes?.includes('drug')
  const isGeneType = sourceTypes?.includes('interaction') || sourceTypes?.includes('gene')

  const loadingVisual = <>loading... TODO</>;

  const sectionsMap = [
    {
      name: 'Data Overview',
      sectionContent: (
        <Box className="box-content">
          <Table>
            <TableBody>
              {isLoading ? (
                loadingVisual
              ) : (
                <>
                  {isInteractionType && (
                    <>
                      <TableRow>
                        <TableCell className="src-attribute-name">
                          Interaction Claims
                        </TableCell>
                        <TableCell>
                          {sourceData.interactionClaimsCount}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="src-attribute-name">
                          Grouped Interaction Claims
                        </TableCell>
                        <TableCell>
                          {sourceData.interactionClaimsInGroupsCount}
                        </TableCell>
                      </TableRow>
                    </>
                  )}
                  {isDrugType && (
                    <>
                      <TableRow>
                        <TableCell className="src-attribute-name">
                          Drug Claims
                        </TableCell>
                        <TableCell>{sourceData.drugClaimsCount}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="src-attribute-name">
                          Grouped Drug Claims
                        </TableCell>
                        <TableCell>
                          {sourceData.drugClaimsInGroupsCount}
                        </TableCell>
                      </TableRow>
                    </>
                  )}
                  {isGeneType && (
                    <>
                      <TableRow>
                        <TableCell className="src-attribute-name">
                          Drug Claims
                        </TableCell>
                        <TableCell>{sourceData.geneClaimsCount}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="src-attribute-name">
                          Grouped Gene Claims
                        </TableCell>
                        <TableCell>
                          {sourceData.geneClaimsInGroupsCount}
                        </TableCell>
                      </TableRow>
                    </>
                  )}
                </>
              )}
            </TableBody>
          </Table>
        </Box>
      ),
    },
    {
      name: 'Source Info',
      sectionContent: (
        <Box className="box-content">
          <Table>
            <TableBody>
              {isLoading ? (
                loadingVisual
              ) : (
                <>
                  <TableRow>
                    <TableCell className="src-attribute-name">
                      Version
                    </TableCell>
                    <TableCell>{sourceData.sourceDbVersion}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="src-attribute-name">
                      License
                    </TableCell>
                    <TableCell>
                      <Link href={sourceData.licenseLink} target="_blank">
                        {sourceData.license}
                      </Link>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="src-attribute-name">
                      Citation
                    </TableCell>
                    <TableCell>
                      {sourceData.citation} TODO make a lil expand button here,
                      also make PMID/etc linkouts
                    </TableCell>
                  </TableRow>
                  {sourceData.sourceTrustLevel && (
                    <TableRow>
                      <TableCell className="src-attribute-name">
                        Trust level (???TODO better title?)
                      </TableCell>
                      <TableCell>{sourceData.sourceTrustLevel.level}</TableCell>
                    </TableRow>
                  )}
                </>
              )}
            </TableBody>
          </Table>
        </Box>
      ),
    },
  ];

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setClaimTab(newValue);
  };

  const claimTabs = [
    {
      title: 'Drug Claims',
      content: isDrugType && <SourceDrugClaims />,
    },
    {
      title: 'Gene Claims',
      content: 'gene claims here',
    },
    { title: 'Interaction Claims', content: 'int claims here' },
  ];

  const claimsBox = (
    <Box>
      <Tabs value={claimTab} onChange={handleTabChange}>
        {claimTabs.map((claim: any) => (
          <Tab label={claim.title} />
        ))}
      </Tabs>
      {claimTabs.map((claim: any, i: number) => (
        <TabPanel value={claimTab} index={i}>
          {claim.content}
        </TabPanel>
      ))}
    </Box>
  );

  return (
    <Box className="source-page-container">
      <Grid container justifyContent="space-between">
        <Grid item>
          <Link href={sourceData?.siteUrl} target="_blank">
            <Typography>{sourceData?.fullName}</Typography>
          </Link>
        </Grid>
        <Grid item>
          <Typography>insert lil source types icon here</Typography>
        </Grid>
      </Grid>
      <Box display="flex">
        <Box display="block" width="35%">
          {sectionsMap.map((section: any) => (
            <Accordion key={section.name} defaultExpanded>
              <AccordionSummary
                className="src-attrib-summary"
                expandIcon={<ExpandMoreIcon />}
              >
                <Typography>{section.name}</Typography>
              </AccordionSummary>
              <AccordionDetails className="src-attrib-details">
                {section.sectionContent}
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
        <Box ml={1} width="65%">
          <Paper>{claimsBox}</Paper>
        </Box>
      </Box>
    </Box>
  );
};
