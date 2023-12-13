import { AppProvider } from './providers/app';
import { AppRoutes } from './routes';
import ReactGA from 'react-ga4';

const TRACKING_ID = "G-B03N45K7C1"

function App() {

  ReactGA.initialize(TRACKING_ID)

  return (
    <AppProvider>
      <AppRoutes />
    </AppProvider>
  );
}

export default App;
