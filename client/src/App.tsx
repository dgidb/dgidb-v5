import { AppProvider } from './providers/app';
import { AppRoutes } from './routes';
import ReactGA from 'react-ga'

ReactGA.initialize('UA-35524735-1')

function App() {
  return (
    <AppProvider>
      <AppRoutes />
    </AppProvider>
  );
}

export default App;
