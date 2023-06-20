import { useGetInteractionClaimTypes } from 'hooks/queries/useGetInteractionClaimTypes';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

export const TypesTable: React.FC = () => {
  const { data } = useGetInteractionClaimTypes();

  function createMarkup(inset_html: any) {
    return { __html: inset_html };
  }

  return (
    <div className="about-section-container doc-section">
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell>Interaction Type</TableCell>
              <TableCell align="right">Description</TableCell>
              <TableCell align="right">Directionality</TableCell>
              <TableCell align="right">References</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.interactionClaimTypes?.nodes?.map(
              (row: any, key: number) => (
                <TableRow
                  key={key}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {row.type}
                  </TableCell>
                  <TableCell align="left">{row.definition}</TableCell>
                  <TableCell align="right">{row.directionality}</TableCell>
                  <TableCell
                    dangerouslySetInnerHTML={createMarkup(row.reference)}
                    align="right"
                  ></TableCell>
                </TableRow>
              )
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};
