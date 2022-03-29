// dependencies
import React from 'react';
// import {
// 	Route,
// 	Switch,
// 	HashRouter,
// 	BrowserRouter
// } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from 'react-query';

// components
import Header from '../header/Header.component';
import Footer from '../footer/Footer.component';
import { Results } from '../../pages/results/results.page';
import Home from '../../pages/home/home.page';

// styles
import '../../utils/styles';
import './App.component.scss';

const queryClient = new QueryClient();

const App: React.FC = () => {
	return (
		<div className="app-container">
			<QueryClientProvider client={queryClient}>
				{/* <BrowserRouter>
					<Header />
					<Switch>
						<Route path="/" exact>
							<Home />
						</Route>
						<Route path="/results">
							<Results />
						</Route>
					</Switch>
					<Footer />
				</BrowserRouter> */}
			</QueryClientProvider>
		</div>
	);
};

export default App;
