
// dependencies
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

function createData(
  interaction_type: string,
  sources: string,
  description: string,
  directionality: string,
  reference: string,
) {
  return { interaction_type, sources, description, directionality, reference };
}

const rows = [
  createData('activator', 'ChemblInteractions, TALC', 'An activator interaction is when a drug activates a biological response from a target, although the mechanism by which it does so may not be understood.', 'activating', 'DrugBank examples: '),
  createData('', '', '', '', ''),
  createData('', '', '', '', ''),
  createData('', '', '', '', ''),
  createData('', '', '', '', ''),
  createData('', '', '', '', ''),
  createData('', '', '', '', ''),

];

export const TypesAndDirectionalities = () => {

  return(
    <div className="types-and-directionalities-section-container doc-section">
      This table has been assembled based upon our own understanding of the definitions of these terms, and we have provided citations to support these definitions. Many of the resources we curate do not provide their own definitions of these terms, and so we encourage users of DGIdb to use these definitions as a starting point, and review interactions of interest from their primary sources. If you have any questions or comments regarding these definitions or the use of DGIdb, please contact us!
    </div>
  )
}