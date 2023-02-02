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
    argument: string;
}

export const CoolComponent: React.FC<Props> = ({argument}) => {
    return (

        <div>
          <HtmlTooltip
            title={
              <React.Fragment>
                <Typography color="inherit">{argument}</Typography>
                <em>{"And here's"}</em> <b>{'some'}</b> <u>{'amazing content'}</u>.{' '}
                {"It's very engaging. Right?"}
              </React.Fragment>
            }
          >
            <Button>{argument}</Button>
          </HtmlTooltip>
        </div>
      );
};


// const test = 'text'

//   export default function CoolTooltips() {

//     return (

//       <div>
//         <HtmlTooltip
//           title={
//             <React.Fragment>
//               <Typography color="inherit">{test}</Typography>
//               <em>{"And here's"}</em> <b>{'some'}</b> <u>{'amazing content'}</u>.{' '}
//               {"It's very engaging. Right?"}
//             </React.Fragment>
//           }
//         >
//           <Button>HTML</Button>
//         </HtmlTooltip>
//       </div>
//     );
//   }