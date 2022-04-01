import * as React from 'react';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

// client state
import { ActionTypes } from 'stores/Global/reducers';
import { GlobalClientContext } from 'stores/Global/GlobalClient';

import styles from'./MainLayout.module.scss';

type MainLayoutProps = {
  children: React.ReactNode;
};

const Header: React.FC = () => {

  const navigate = useNavigate();

  return (
    <header>
      <nav>
        <ul>
          <li onClick={() => navigate('/browse')}>
            Browse
          </li>
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
    <button onClick={() => dispatch({type: ActionTypes.HideDisclaimer})}>X</button>
    Disclaimer: This resource is intended for purely research purposes. It should not be used for emergencies or medical or professional advice. 
  </footer>
  )
}

export const MainLayout = ({children }: MainLayoutProps) => {

  const {state} = useContext(GlobalClientContext);

  return(
    <div className={styles["layout-container"]}>
      <Header />
      {children}
      {state.themeSettings.showDisclaimer && <Footer />}
    </div>
  )
}