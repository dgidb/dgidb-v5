import React from 'react';
import {
	Route,
	Switch,
	HashRouter,
	BrowserRouter
} from 'react-router-dom'

import { QueryClient, QueryClientProvider } from 'react-query';

import Header from '../header/Header.component';
import { Results } from '../../pages/results/results.page';

import '../../common/styles';
import './App.component.scss';

const queryClient = new QueryClient();

const App: React.FC = () => {
	return (
		<HashRouter>
			<Header />
			<Switch>
				<Route path="/">
					<QueryClientProvider client={queryClient}>
						{/* <Home /> */}
						<Results />
					</QueryClientProvider>
				</Route>
			</Switch>
		</HashRouter>
	);
};

export default App;
