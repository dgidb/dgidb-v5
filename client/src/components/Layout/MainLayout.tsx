import * as React from 'react';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

// client state
import { ActionTypes } from 'stores/Global/reducers';
import { GlobalClientContext } from 'stores/Global/GlobalClient';

// style
import './MainLayout.scss';
import {CloseCircleOutlined, DownOutlined} from '@ant-design/icons';
import { Dropdown, Menu, Space } from 'antd';

type MainLayoutProps = {
  children: React.ReactNode;
};

const Header: React.FC = () => {

  const navigate = useNavigate();
  const menu = (
    <Menu>
      <Menu.Item key="categories" onClick={() => navigate('/browse/categories')}>
        <li>Categories</li>
      </Menu.Item>
      <Menu.Item key="sources" onClick={() => navigate('/browse/sources')}>
        <li>Sources</li>
      </Menu.Item>
    </Menu>
  )

  return (
    <header>
      <div className="header-logo" onClick={() => navigate('/')}>
        DGIdb
      </div>
      <nav>
        <ul>
          <li>
            <Dropdown overlay={menu}>
              <Space>
                Browse
              </Space>
            </Dropdown>
          </li>
          <li onClick={() => navigate('/about')}>
            About
          </li>
          <li onClick={() => navigate('/download')}>
            Downloads
          </li>
          <li onClick={() => navigate('/playground')}>
            Playground
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
        {children}
      </div>
      {state.themeSettings.showDisclaimer && <Footer />}
    </div>
  )
}