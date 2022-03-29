import * as React from 'react';

import './MainLayout.scss';

type MainLayoutProps = {
  children: React.ReactNode;
};

const Header: React.FC = () => {
  return (
    <header>
      <nav>
        <ul>
          <li>
            Browse
          </li>
          <li>
            About
          </li>
          <li>
            Download
          </li>
        </ul>
      </nav>
    </header>

  )
}

const Footer: React.FC = () => {
  return (
  <div className="home-footer">
    Disclaimer: This resource is intended for purely research purposes. It should not be used for emergencies or medical or professional advice. 
  </div>
  )
}

export const MainLayout = ({children }: MainLayoutProps) => {

  return(
    <div>
      <Header />
      {children}
      <Footer />
    </div>
  )
}