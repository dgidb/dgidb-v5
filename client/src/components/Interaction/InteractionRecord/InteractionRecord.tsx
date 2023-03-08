// hooks / dependencies
import React from "react";
import { useGetInteractionRecord } from "hooks/queries/useGetInteractionRecord";

// styles
import TableBody from "@mui/material/TableBody";
import Table from "@mui/material/Table";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Box from "@mui/material/Box";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";



export const InteractionRecord: React.FC = () => {

    const { data } = useGetInteractionRecord('f132437e-53e3-4ab3-98a2-b75608f43d4d');

    const noData = (
        <TableRow>
          <TableCell style={{ borderBottom: "none" }}>No data available.</TableCell>
        </TableRow>
      );

    return (
      <div>
      <p>hello</p>
      <Table>
        <TableBody>
          {noData}
        </TableBody>
      </Table>
      </div>
      );
};

export const InteractionRecordContainer: React.FC = () => {
    return (
      <>
        <InteractionRecord />
      </>
    );
  };
