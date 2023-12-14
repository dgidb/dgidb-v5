import { AppProvider } from './providers/app';
import { AppRoutes } from './routes';
import ReactGA from 'react-ga4';

const sendAnalytics = process.env.REACT_APP_ANALYTICS === "true"

const TRACKING_ID = "G-B03N45K7C1"

function App() {

  if (sendAnalytics) {
    ReactGA.initialize(TRACKING_ID)
  };

  return (
    <AppProvider>
      <AppRoutes />
    </AppProvider>
  );
}

export default App;
