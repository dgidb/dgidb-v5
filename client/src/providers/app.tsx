// dependencies
import React from 'react';
// import {
// 	Route,
// 	Switch,
// 	HashRouter,
// 	BrowserRouter
// } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter as Router } from 'react-router-dom';

// components
// import Header from '../header/Header.component';
// import Footer from '../footer/Footer.component';
// import { Results } from '../../pages/results/results.page';
// import Home from '../../pages/home/home.page';

// styles
// import '../../utils/styles';
// import './App.component.scss';

const queryClient = new QueryClient();

type AppProviderProps = {
  children: React.ReactNode;
};

export const AppProvider = ({ children }: AppProviderProps) => {
  return (
    <div className="app-container">
      <QueryClientProvider client={queryClient}>
        <Router>
          {children}
        </Router>
      </QueryClientProvider>
    </div>
  );
};

