import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import Header from '../header/Header.component';

import '../../common/styles';
import './App.component.scss'

const App: React.FC = () => {
  return (
    <Router>
      <Header />
    </Router>
    
  );
}

export default App;