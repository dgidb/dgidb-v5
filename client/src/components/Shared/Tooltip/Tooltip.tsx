import * as React from 'react';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';

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

export const SourcesTooltip: React.FC<Props> = ({displayText,hoverTexts}) => {
    return (
        <div>
          <HtmlTooltip
            title={
              <>
                <Typography color="inherit">{hoverTexts.map((row: any, key:number) => (
                    <p>{row.fullName}</p>
                ))}
                </Typography>
                <em>Full citation and license can be found under <b>Browse Sources</b>.</em>
              </>
            }
          >
            <Button>{displayText}</Button>
          </HtmlTooltip>
        </div>
      );
};

export const PublicationsTooltip: React.FC<Props> = ({displayText,hoverTexts}) => {
    return (
        <div>
          <HtmlTooltip
            title={
              <>
                <Typography color="inherit">{hoverTexts.map((row: any, key:number) => (
                    <p><Link href={'https://pubmed.ncbi.nlm.nih.gov/' + row.pmid}>{row.pmid}</Link></p>
                ))}
                </Typography>
                <em>Full publications above</em>
              </>
            }
          >
            <Button>{displayText}</Button>
          </HtmlTooltip>
        </div>
      );
};