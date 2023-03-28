import React, { useState } from 'react';

import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import DownloadIcon from '@mui/icons-material/Download';

import { API_URL } from 'config';
import Box from '@mui/material/Box';

interface Props<FilterVars> {
  tableName: string;
  vars: FilterVars
}

export function TableDownloader<FV>(props: React.PropsWithChildren<Props<FV>>) {
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const onDownloadClick = () => {
    setIsLoading(true)
    setHasError(false);
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({variables: props.vars})
    }
    fetch(`${API_URL}/download/${props.tableName}`, options).then(resp => {
      if (resp.ok) {
        resp.blob().then(blob => {
          const fileUrl =  window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = fileUrl
          a.style.display = 'none';
          a.download = `${props.tableName}-${new Date().toLocaleString().split(',')[0]}.tsv`;
          document.body.append(a);
          a.click();
          setTimeout(() => { window.URL.revokeObjectURL(fileUrl); }, 400);
          setIsLoading(false);
        })
      } else {
        setIsLoading(false)
        setHasError(true)
      }
    })
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <Button variant="outlined" 
        endIcon={<DownloadIcon />}
        disabled={isLoading}
        onClick={onDownloadClick}>
        Download
      </Button>
      { isLoading && <CircularProgress/> }
      { hasError && <Alert severity='error'
                      onClose={() => {setHasError(false)}}>
                        There was an error downloading the file.
                      </Alert>}
    </Box>
  )
}

export default TableDownloader;