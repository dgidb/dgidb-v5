import * as React from 'react';
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// client state
import { GlobalClientContext } from 'stores/Global/GlobalClient';

// style
import './MainLayout.scss';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Link,
  Menu,
  MenuItem,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ReleaseInformation from 'components/Shared/ReleaseInformation/ReleaseInformation';

type MainLayoutProps = {
  children: React.ReactNode;
};

const Header: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [hideBanner, setHideBanner] = useState(
    window.localStorage.getItem('banner-closed')
  );

  const handleOpen = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCloseNotificationBanner = () => {
    setHideBanner('true');
    window.localStorage.setItem('banner-closed', 'true');
  };

  const navigate = useNavigate();

  return (
    <header>
      <Box display="flex">
        <div className="header-logo" onClick={() => navigate('/')}>
          DGIdb
        </div>
        <nav>
          <ul>
            <li>
              <Button className="browse-button" onClick={handleOpen}>
                Browse
              </Button>
              <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'center',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'center',
                }}
              >
                <MenuItem
                  onClick={() => {
                    handleClose();
                    navigate('/browse/categories');
                  }}
                >
                  Categories
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    handleClose();
                    navigate('/browse/sources');
                  }}
                >
                  Sources
                </MenuItem>
              </Menu>
            </li>
            <li onClick={() => navigate('/about')}>About</li>
            <li onClick={() => navigate('/downloads')}>Downloads</li>
          </ul>
        </nav>
      </Box>
      {!hideBanner ? (
        <Box className="header-banner">
          <Box>
            The previous version of DGIdb can be found at{' '}
            <Link href="https://old.dgidb.org" color="inherit">
              old.dgidb.org
            </Link>{' '}
            until June 1st, 2024.
          </Box>
          <IconButton
            aria-label="close"
            size="small"
            onClick={handleCloseNotificationBanner}
          >
            <CloseIcon fontSize="inherit" />
          </IconButton>
        </Box>
      ) : (
        ''
      )}
    </header>
  );
};

const Footer: React.FC = () => {
  return (
    <footer>
      <ReleaseInformation />
    </footer>
  );
};

const DisclaimerPopup: React.FC = () => {
  const [hideDisclaimer, setHideDisclaimer] = useState(
    window.localStorage.getItem('disclaimer-closed')
  );

  const handleClose = () => {
    setHideDisclaimer('true');
    window.localStorage.setItem('disclaimer-closed', 'true');
  };

  return (
    <>
      <Dialog
        open={!(hideDisclaimer === 'true')}
        onClose={handleClose}
        aria-labelledby="disclaimer-dialog-title"
        aria-describedby="disclaimer-dialog-description"
      >
        <DialogTitle id="disclaimer-dialog-title">
          <b>Disclaimer:</b> This resource is intended for purely research
          purposes. It should not be used for emergencies or medical or
          professional advice.
        </DialogTitle>
        <IconButton
          aria-label="close"
          size="small"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
          }}
        >
          <CloseIcon fontSize="inherit" />
        </IconButton>
        <hr />
        <DialogContent>
          <DialogContentText id="disclaimer-dialog-description">
            <Box mb={2}>
              {
                'A finding of a drug-gene interaction or potentially druggable category does not necessarily indicate effectiveness (or lack thereof) of any drug or treatment regimen. A finding of no interaction or no potentially druggable category does not necessarily indicate lack of effectiveness of any drug or treatment regimen. Drug-gene interactions or potentially druggable categories are not presented in ranked order of potential or predicted efficacy.'
              }
            </Box>
            <Box>
              {
                "The dgidb.org website does not provide any medical or healthcare products, services or advice, and is not for medical emergencies or urgent situations. IF YOU THINK YOU MAY HAVE A MEDICAL EMERGENCY, CALL YOUR DOCTOR OR 911 IMMEDIATELY. Information contained on this website is not a substitute for a doctor's medical judgment or advice. We recommend that you discuss your specific, individual health concerns with your doctor or health care professional."
              }
            </Box>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export const MainLayout = ({ children }: MainLayoutProps) => {
  const { state } = useContext(GlobalClientContext);

  let theme;

  if (state.themeSettings.darkModeEnabled) {
    if (state.themeSettings.brandTheme) {
      theme = 'dark-home';
    } else {
      theme = 'dark';
    }
  } else {
    if (state.themeSettings.brandTheme) {
      theme = 'light-home';
    } else {
      theme = 'light';
    }
  }

  return (
    <div className={'layout-container'} data-theme={theme}>
      <DisclaimerPopup />
      <Header />
      <div className="content-container">
        <Box className="content">{children}</Box>
      </div>
      <Footer />
    </div>
  );
};
