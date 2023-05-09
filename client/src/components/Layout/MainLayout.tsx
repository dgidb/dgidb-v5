import * as React from 'react';
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// client state
import { ActionTypes } from 'stores/Global/reducers';
import { GlobalClientContext } from 'stores/Global/GlobalClient';

// style
import './MainLayout.scss';
import {CloseCircleOutlined} from '@ant-design/icons';
import { Box, Button, Menu, MenuItem } from '@mui/material';

type MainLayoutProps = {
  children: React.ReactNode;
};

const Header: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpen = (event: any) => {
    setAnchorEl(event.currentTarget);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const navigate = useNavigate();

  return (
    <header>
      <div className="header-logo" onClick={() => navigate('/')}>
        DGIdb
      </div>
      <nav>
        <ul>
          <li onMouseLeave={handleClose}>
            <Button style={{textTransform: 'none', fontSize: '18px', color: 'white', zIndex: 1301}}
            onMouseOver={handleOpen}>Browse</Button>
            <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          open={open}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center"
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "center"
          }}
        >
          <MenuItem onClick={() => navigate('/categories')}>Categories</MenuItem>
          <MenuItem onClick={() => navigate('/sources')}>Sources</MenuItem>
        </Menu>
          </li>
          <li onClick={() => navigate('/about')}>
            About
          </li>
          <li onClick={() => navigate('/downloads')}>
            Downloads
          </li>
        </ul>
      </nav>
    </header>
  )
}

const Footer: React.FC = () => {

  const {dispatch} = useContext(GlobalClientContext);

  return (
  <footer>

    Disclaimer: This resource is intended for purely research purposes. It should not be used for emergencies or medical or professional advice.
    <CloseCircleOutlined
    style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', marginLeft: '10px', fontSize: '25px'}}
    onClick={() => dispatch({type: ActionTypes.HideDisclaimer})}
    />
  </footer>
  )
}

export const MainLayout = ({children }: MainLayoutProps) => {

  const {state} = useContext(GlobalClientContext);

  let theme;

  if (state.themeSettings.darkModeEnabled) {
    if (state.themeSettings.brandTheme){
      theme = 'dark-home';
    } else {
      theme = 'dark';
    }
  } else {
    if (state.themeSettings.brandTheme){
      theme = 'light-home';
    } else {
      theme = 'light';
    }
  }

  return(
    <div className={"layout-container"} data-theme={theme}>
      <Header />
      <div className="content-container">
        <Box className='content'>
          {children}
        </Box>
      </div>
      {state.themeSettings.showDisclaimer && <Footer />}
    </div>
  )
}