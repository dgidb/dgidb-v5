import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter as Router } from 'react-router-dom';
import { GlobalClient } from 'stores/Global/GlobalClient';

export const queryClient = new QueryClient();
export const GlobalContext = React.createContext(null);

type AppProviderProps = {
  children: React.ReactNode;
}

export const AppProvider = ({ children }: AppProviderProps) => {
  return (
    <div className="app-container">
      <GlobalClient>
        <QueryClientProvider client={queryClient}>
          <Router>
            {children}
          </Router>
        </QueryClientProvider>
      </GlobalClient>
    </div>
  )
}

