import './SurveryAlert.scss';

import React from 'react';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Button from '@mui/material/Button';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

export const SurveyAlert: React.FC = () => {
  return (
    <div className="survey-alert">
      <Alert
        severity="info"
        icon={
          <img
            src="/images/survey.png"
            alt="Survey Logo"
            style={{ width: 93, height: 71 }} //this is just 50% scale for the image, preserving aspect ratio
          />
        }
      >
        <AlertTitle>
          <span className="survey-title">Help shape the future of DGIdb!</span>
        </AlertTitle>
        <span className="survey-body">
          Let us know how to improve DGIdb by taking our{' '}
          <Button
            size="small"
            disableRipple
            target="_blank"
            component="a"
            href="https://docs.google.com/forms/d/e/1FAIpQLSeO8v_RB9yIdzwLFezuhCfd9gtiSmwrcjJFfJSES8l5grIQhw/viewform"
            variant="outlined"
            endIcon={<OpenInNewIcon />}
          >
            2 minute survey!
          </Button>
        </span>
      </Alert>
    </div>
  );
};
