import React from 'react';
import { NavLink } from 'react-router-dom';
import { Button } from 'antd';

import './Header.component.scss'

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

export default Header;