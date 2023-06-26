import { Box, Checkbox, FormControlLabel, Typography } from '@mui/material';
import { ErrorMessage } from 'components/Shared/ErrorMessage/ErrorMessage';
import { LoadingSpinner } from 'components/Shared/LoadingSpinner/LoadingSpinner';
import React, { useState } from 'react';
import './CategoriesCheckboxContainer.scss';

interface Props {
  checkOptions: string[];
  checkedSources: string[];
  setCheckedSources: CallableFunction;
  isLoading: boolean;
  isError: boolean;
}

export const CategoriesCheckboxContainer: React.FC<Props> = ({
  checkOptions,
  checkedSources,
  setCheckedSources,
  isLoading,
  isError,
}) => {
  const [checkAll, setCheckAll] = useState<boolean>(false);
  const [checkAllIndeterminate, setCheckAllIndeterminate] =
    useState<boolean>(true);

  const onCheckAllChange = (event: any) => {
    setCheckedSources(event.target.checked ? checkOptions : []);
    setCheckAllIndeterminate(false);
    setCheckAll(event.target.checked);
  };

  const onCheckChange = (event: any) => {
    if (checkedSources.includes(event.target.id)) {
      const newList = checkedSources.filter((selectedOption: any) => {
        return selectedOption !== (event.target.id as string);
      });
      setCheckedSources(newList);
    } else {
      setCheckedSources([...checkedSources, event.target.id]);
    }
  };

  return (
    <Box className="browse-cats-checkbox-container">
      <Typography variant="h6">Select sources:</Typography>
      <>
        {isLoading ? (
          <LoadingSpinner />
        ) : isError ? (
          <ErrorMessage />
        ) : (
          <>
            <FormControlLabel
              label="Select/Deselect All"
              control={
                <Checkbox
                  checked={checkAll}
                  indeterminate={checkAllIndeterminate}
                  onChange={onCheckAllChange}
                />
              }
            />
            <Box sx={{ ml: 2 }}>
              {checkOptions.map((option: any, index: number) => {
                return (
                  <Box key={index}>
                    <FormControlLabel
                      label={option}
                      control={
                        <Checkbox
                          checked={checkedSources.includes(option)}
                          onChange={onCheckChange}
                          id={option}
                          style={{ padding: '.5em' }}
                        />
                      }
                    />
                  </Box>
                );
              })}
            </Box>
          </>
        )}
      </>
    </Box>
  );
};
