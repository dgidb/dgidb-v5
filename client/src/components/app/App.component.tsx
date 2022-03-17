import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';

import Header from '../header/Header.component';
import Home from '../../pages/home/home.page';
import { Results } from '../../pages/results/results.page';

import '../../common/styles';
import './App.component.scss';

const queryClient = new QueryClient();

const App: React.FC = () => {
	return (
		<Router>
			<Header />
			<Switch>
				<Route path="/">
					<QueryClientProvider client={queryClient}>
						{/* <Home /> */}
						<Results />
					</QueryClientProvider>
				</Route>
			</Switch>
		</Router>
	);
};

export default App;
