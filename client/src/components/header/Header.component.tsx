import React from 'react';
import { NavLink } from 'react-router-dom';

import './Header.component.scss'

const Header: React.FC = () => {
  return (
    <header>
      <nav>
        <ul>
          <li>
            {/* <NavLink to="/">Home</NavLink> */}
          </li>
        </ul>
      </nav>
    </header>

  )
}

export default Header;