import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Header from '../header/Header.component';
import Home from '../../pages/home/home.page'


import '../../common/styles';
import './App.component.scss'
import { ApolloProvider } from '@apollo/client';

import client from '../../common/apollo-client'

const App: React.FC = () => {
  return (
    <ApolloProvider client={client}>
      <Router>
        <Header />
        <Switch>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </Router>
    </ApolloProvider>

    
  );
}

export default App;