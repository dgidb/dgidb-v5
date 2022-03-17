// dependencies
import React from 'react';
import {
	Route,
	Switch,
	HashRouter,
	BrowserRouter
} from 'react-router-dom'
import { QueryClient, QueryClientProvider } from 'react-query';

// components
import Header from '../header/Header.component';
import { Results } from '../../pages/results/results.page';
import Home from '../../pages/home/home.page';

// styles
import '../../common/styles';
import './App.component.scss';

const queryClient = new QueryClient();

const App: React.FC = () => {
	return (
		<QueryClientProvider client={queryClient}>
			<HashRouter>
				<Header />
				<Switch>
					<Route path="/">
							<Home />
					</Route>
					<Route path="/interactions">
							<Results />
					</Route>
				</Switch>
			</HashRouter>
		</QueryClientProvider>
	);
};

export default App;
