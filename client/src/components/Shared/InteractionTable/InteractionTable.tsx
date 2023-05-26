// hooks/dependencies
import React from "react";

// styles
import "./InteractionTable.scss";
import { Box, LinearProgress } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { truncateDecimals } from "utils/format";
import { useNavigate, useSearchParams } from "react-router-dom";
import { PublicationsTooltip, SourcesTooltip } from "../Tooltip/Tooltip";
import { ResultTypes } from "types/types";

interface Props {
  isLoading: boolean;
  interactionResults: any;
  recordType?: string;
  ambiguous?: boolean;
}

export const InteractionTable: React.FC<Props> = ({
  interactionResults,
  isLoading,
  recordType = "",
  ambiguous = false,
}) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const resultType = searchParams.get("searchType") as ResultTypes;  // TODO use SearchType/ResultsType enum

  const termColumn = {
    field: "term",
    headerName: "Term",
    flex: 0.5,
    minWidth: 0,
  };

  const geneColumn = {
    field: "gene",
    headerName: "Gene",
    flex: 0.5,
    minWidth: 0,
    renderCell: (params: any) => (
      <a
        href={`/genes/${params.row.geneId}`}
        onClick={(event) => event.stopPropagation()}
        className="record-link"
      >
        {params.row.gene}
      </a>
    ),
  };

  const drugColumn = {
    field: "drug",
    headerName: "Drug",
    flex: 1,
    minWidth: 0,
    renderCell: (params: any) => (
      <a
        href={`/drugs/${params.row.drugId}`}
        onClick={(event) => event.stopPropagation()}
        className="record-link"
      >
        {params.row.drug}
      </a>
    ),
  };

  const searchColumns = [
    {
      field: "regulatoryApproval",
      headerName: "Regulatory Approval",
      flex: 0.8,
      minWidth: 0,
    },
    {
      field: "indication",
      headerName: "Indication",
      flex: 1,
      minWidth: 0,
    },
    {
      field: "interactionScore",
      headerName: "Interaction Score",
      flex: 0.6,
      minWidth: 0,
    },
  ];

  const recordColumns = [
    {
      field: "interactionTypes",
      headerName: "Interaction Types",
      flex: 1,
      minWidth: 0,
    },
    {
      field: "pmids",
      headerName: "PMIDs",
      flex: 0.4,
      minWidth: 0,
      renderCell: (params: any) => (
        <PublicationsTooltip
          displayText={params.row.pmids?.length}
          hoverTexts={params.row.pmids}
        />
      ),
    },
    {
      field: "sources",
      headerName: "Sources",
      flex: 0.4,
      minWidth: 0,
      renderCell: (params: any) => (
        <SourcesTooltip
          hoverTexts={params.row.sources}
          displayText={params.row.sources?.length}
        />
      ),
    },
    {
      field: "interactionScore",
      headerName: "Interaction Score",
      flex: 0.6,
      minWidth: 0,
    },
  ];

  let columns: any = [];

  if (ambiguous) {
    if (resultType === ResultTypes.Gene) {
      columns = [geneColumn, drugColumn, ...searchColumns];
    } else if (resultType === ResultTypes.Drug) {
      columns = [drugColumn, geneColumn, ...searchColumns];
    }
  } else {
    if (resultType === ResultTypes.Gene) {
      columns = [termColumn, geneColumn, drugColumn, ...searchColumns];
    } else if (resultType === ResultTypes.Drug) {
      columns = [termColumn, drugColumn, geneColumn, ...searchColumns];
    } else if (recordType === ResultTypes.Gene) {
      columns = [drugColumn, ...recordColumns];
    } else if (recordType === ResultTypes.Drug) {
      columns = [geneColumn, ...recordColumns];
    }
  }

  const handleEvent = (event: any) => {
    navigate("/interactions/" + event.row.id);
  };

  const rows = interactionResults?.map((interaction: any) => {
    return {
      id: interaction.id,
      term: interaction.term,
      gene: interaction?.gene?.name,
      geneId: interaction?.gene?.conceptId,
      drug: interaction?.drug?.name,
      drugId: interaction?.drug?.conceptId,
      regulatoryApproval: interaction?.drug?.approved
        ? "Approved"
        : "Not Approved",
      indication: interaction?.drug?.drugAttributes?.filter(
        (attribute: any) => {
          return attribute.name === "Drug Indications";
        }
      )?.[0]?.value,
      interactionScore: truncateDecimals(interaction?.interactionScore, 2),
      interactionTypes: interaction?.interactionTypes
        ?.map((interactionType: any) => {
          return interactionType.type;
        })
        .join(", "),
      pmids: interaction?.publications,
      sources: interaction?.sources,
    };
  });

  return !isLoading ? (
    <Box className="interaction-table-container">
      <Box width="100%" height="500px" display="flex">
        <DataGrid
          onRowClick={handleEvent}
          columns={columns}
          rows={rows}
          pagination
          pageSizeOptions={[25, 50, 100]}
          className="data-grid"
          classes={{
            columnHeader: "table-header",
            menuIcon: "column-menu-button",
            cell: "table-cell",
            toolbarContainer: "footer",
          }}
          rowSelection={false}
          showColumnVerticalBorder
        />
      </Box>
    </Box>
  ) : (
      <LinearProgress
        sx={{
          backgroundColor: "white",
          "& .MuiLinearProgress-bar": {
            backgroundColor: "#480a77",
          },
        }}
        className="linear-bar"
      />
  );
};

export default InteractionTable;
