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

    // const sectionsMap = [
    //     {
    //       name: "Interaction Info",
    //       sectionContent: (
    //         <Box className="box-content">
    //           <Table>
    //             <TableBody>
    //               {data?.geneAttributes.length
    //                 ? data?.geneAttributes?.map((attribute: any) => {
    //                     return (
    //                       <TableRow key={attribute.name + " " + attribute.value}>
    //                         <TableCell className="attribute-name">
    //                           {attribute.name}:
    //                         </TableCell>
    //                         <TableCell className="attribute-value">
    //                           {attribute.value}
    //                         </TableCell>
    //                       </TableRow>
    //                     );
    //                   })
    //                 : noData}
    //             </TableBody>
    //           </Table>
    //         </Box>
    //       ),
    //     },
    //     {
    //       name: "Categories",
    //       sectionContent: (
    //         <Box className="box-content">
    //           <Table>
    //             <TableBody>
    //               {data?.geneCategories
    //                 ? data?.geneCategories?.map((category: any) => {
    //                     return (
    //                       <TableRow key={category.name + " " + category.value}>
    //                         <TableCell className="attribute-name">
    //                           {category.name}
    //                         </TableCell>
    //                       </TableRow>
    //                     );
    //                   })
    //                 : noData}
    //             </TableBody>
    //           </Table>
    //         </Box>
    //       ),
    //     },
    //     {
    //       name: "Publications",
    //       sectionContent: (
    //         <Box className="box-content publication-item">
    //           <Table>
    //             <TableBody>
    //               {data?.geneClaims
    //                 ? data?.geneClaims?.map((claim: any, index: number) => {
    //                     return (
    //                       <TableRow key={index}>
    //                         <TableCell className="attribute-name">
    //                           {claim?.source?.citation}
    //                         </TableCell>
    //                       </TableRow>
    //                     );
    //                   })
    //                 : noData}
    //             </TableBody>
    //           </Table>
    //         </Box>
    //       ),
    //     },
    //   ];


    return(
    <p>hello</p>
    );
};