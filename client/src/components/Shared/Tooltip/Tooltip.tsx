import * as React from 'react';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: '#f5f5f9',
      color: 'rgba(0, 0, 0, 0.87)',
      maxWidth: 220,
      fontSize: theme.typography.pxToRem(12),
      border: '1px solid #dadde9',
    },
  }));

interface Props {
    display_text: string;
    hover_texts: any;
}

export const SourcesTooltip: React.FC<Props> = ({display_text,hover_texts}) => {
    return (

        <div>
          <HtmlTooltip
            title={
              <React.Fragment>
                <Typography color="inherit">{hover_texts.map((row: any, key:number) => (
                    <p>{row.fullName}</p>
                ))}
                </Typography>
                <em>{"And here's"}</em> <b>{'some'}</b> <u>{'amazing content'}</u>.{' '}
                {"It's very engaging. Right?"}
              </React.Fragment>
            }
          >
            <Button>{display_text}</Button>
          </HtmlTooltip>
        </div>
      );
};

export const PublicationsTooltip: React.FC<Props> = ({display_text,hover_texts}) => {
    return (

        <div>
          <HtmlTooltip
            title={
              <React.Fragment>
                <Typography color="inherit">{hover_texts.map((row: any, key:number) => (
                    <p>{row.pmid}</p>
                ))}
                </Typography>
                <em>{"And here's"}</em> <b>{'some'}</b> <u>{'amazing content'}</u>.{' '}
                {"It's very engaging. Right?"}
              </React.Fragment>
            }
          >
            <Button>{display_text}</Button>
          </HtmlTooltip>
        </div>
      );
};