import * as React from "react";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

// client state
import { ActionTypes } from "stores/Global/reducers";
import { GlobalClientContext } from "stores/Global/GlobalClient";

// style
import "./MainLayout.scss";
import { Box, Button, IconButton, Menu, MenuItem } from "@mui/material";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";

type MainLayoutProps = {
  children: React.ReactNode;
};

const Header: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpen = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const navigate = useNavigate();

  return (
    <header>
      <div className="header-logo" onClick={() => navigate("/")}>
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
                vertical: "bottom",
                horizontal: "center",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "center",
              }}
            >
              <MenuItem
                onClick={() => {
                  handleClose();
                  navigate("/browse/categories");
                }}
              >
                Categories
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleClose();
                  navigate("/browse/sources");
                }}
              >
                Sources
              </MenuItem>
            </Menu>
          </li>
          <li onClick={() => navigate("/about")}>About</li>
          <li onClick={() => navigate("/downloads")}>Downloads</li>
        </ul>
      </nav>
    </header>
  );
};

const Footer: React.FC = () => {
  const { dispatch } = useContext(GlobalClientContext);

  return (
    <footer>
      Disclaimer: This resource is intended for purely research purposes. It
      should not be used for emergencies or medical or professional advice.
      <IconButton
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          marginLeft: "10px",
          fontSize: "25px",
        }}
        onClick={() => dispatch({ type: ActionTypes.HideDisclaimer })}
      >
        <HighlightOffIcon />
      </IconButton>
    </footer>
  );
};

export const MainLayout = ({ children }: MainLayoutProps) => {
  const { state } = useContext(GlobalClientContext);

  let theme;

  if (state.themeSettings.darkModeEnabled) {
    if (state.themeSettings.brandTheme) {
      theme = "dark-home";
    } else {
      theme = "dark";
    }
  } else {
    if (state.themeSettings.brandTheme) {
      theme = "light-home";
    } else {
      theme = "light";
    }
  }

  return (
    <div className={"layout-container"} data-theme={theme}>
      <Header />
      <div className="content-container">
        <Box className="content">{children}</Box>
      </div>
      {state.themeSettings.showDisclaimer && <Footer />}
    </div>
  );
};
