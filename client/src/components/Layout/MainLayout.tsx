import * as React from 'react';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

// client state
import { ActionTypes } from 'stores/Global/reducers';
import { GlobalClientContext } from 'stores/Global/GlobalClient';

// style
import './MainLayout.scss';
import {CloseCircleOutlined} from '@ant-design/icons';
import { Menu } from 'antd';

type MainLayoutProps = {
  children: React.ReactNode;
};

const Header: React.FC = () => {

  const navigate = useNavigate();

  return (
    <header>
      <div className="header-logo" onClick={() => navigate('/')}>
        DGIdb
      </div>
      <nav>
        <ul>
          <Menu mode="horizontal"  theme="dark">
            <Menu.SubMenu key="SubMenu" title="Browse" >
              <Menu.Item key="categories" onClick={() => navigate('/browse/categories')}>
                Categories
              </Menu.Item>
              <Menu.Item key="sources" onClick={() => navigate('/browse/sources')}>
                Sources
              </Menu.Item>
            </Menu.SubMenu>
          </Menu>
          {/* <li onClick={() => navigate('/browse')}>
            Browse
          </li> */}
          <li onClick={() => navigate('/about')}>
            About
          </li>
          <li onClick={() => navigate('/download')}>
            Download
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

  const theme = state.themeSettings.darkModeEnabled ? 'dark' : 'light';

  return(
    <div className={"layout-container"} data-theme={theme}>
      <Header />
      <div className="content-container">
        {children}
      </div>
      {state.themeSettings.showDisclaimer && <Footer />}
    </div>
  )
}