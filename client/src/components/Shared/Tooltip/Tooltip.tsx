import React from 'react';
import { styled } from '@mui/material/styles';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import Link from '@mui/material/Link';
import { Box } from '@mui/material';
import './Tooltip.scss'

const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: '#f5f5f9',
      color: 'rgba(0, 0, 0, 0.87)',
      maxWidth: 220,
      minWidth: 160,
      fontSize: theme.typography.pxToRem(12),
      border: '1px solid #dadde9',
    },
  }));

interface Props {
    displayText: string;
    hoverTexts: any;
}

export const SourcesTooltip: React.FC<Props> = ({displayText, hoverTexts}) => {
    return (
        <div>
          <HtmlTooltip
            title={
              <>
                <Box color='inherit' maxHeight='300px' overflow='scroll'>{hoverTexts.map((row: any, index: number) => (
                    <Box mb={1} key={index}>{row.fullName}</Box>
                ))}
                </Box>
                <em>Full citation and license can be found under <b>Browse Sources</b>.</em>
              </>
            }
          >
            <Box className='tooltip' px={2}>{displayText}</Box>
          </HtmlTooltip>
        </div>
      );
};

export const PublicationsTooltip: React.FC<Props> = ({displayText, hoverTexts}) => {
    return (
        <div>
          <HtmlTooltip
            title={
              <>
                <Box color='inherit' maxHeight='300px' overflow='scroll'>{hoverTexts.map((row: any, index :number) => (
                    <Box mb={1} key={index}><Link href={'https://pubmed.ncbi.nlm.nih.gov/' + row.pmid} target='_blank'>{row.pmid}</Link></Box>
                ))}
                </Box>
                <em>{displayText && ~~displayText > 0 ? "Full publications above" : "No supporting publications"}</em>
              </>
            }
          >
            <Box className='tooltip' px={2}>{displayText}</Box>
          </HtmlTooltip>
        </div>
      );
};