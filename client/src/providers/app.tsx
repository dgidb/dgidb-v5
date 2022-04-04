// dependencies
import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter as Router } from 'react-router-dom';

// styles
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

