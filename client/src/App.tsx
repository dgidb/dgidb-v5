import { AppProvider } from './providers/app';
import { AppRoutes } from './routes';
import ReactGA from 'react-ga4';

const isProd = process.env.REACT_APP_API_URI === 'http://127.0.0.1:3000/api/graphql'
const TRACKING_ID = "G-B03N45K7C1"

function App() {

  if (isProd) {
    ReactGA.initialize(TRACKING_ID)
  };

  return (
    <AppProvider>
      <AppRoutes />
    </AppProvider>
  );
}

export default App;
