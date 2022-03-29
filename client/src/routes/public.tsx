import { Suspense } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

// import Home from 'pages/home/home.page';
// import { Results } from 'pages/results';
import { MainLayout } from 'components/Layout';
import { lazyImport } from 'utils/lazyImport';


const { Home } = lazyImport(() => import('pages/home'), 'Home');
const { Results } = lazyImport(() => import('pages/results'), 'Results');

const App = () => {
  return (
    <MainLayout>
      <Suspense
        fallback={
          <div className="h-full w-full flex items-center justify-center">
            {/* <Spinner size="xl" /> */}
            spinner
          </div>
        }
      >
        <Outlet />
      </Suspense>
    </MainLayout>
  );
};

export const publicRoutes = [
  {
    path: '/app',
    element: <App />,
    children: [
      { path: '/app/results', element: <Results /> },
      { path: '/app/home', element: <Home /> },
      // { path: '*', element: <Navigate to="." /> },
    ],
  },
  // {
  //   path: '/home',
  //   element: <Home />
  // }
];
