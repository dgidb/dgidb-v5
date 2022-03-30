import { Suspense } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

import { Home } from 'pages/home';
import { Results } from 'pages/results';
import { MainLayout } from 'components/Layout';


const App = () => {
  return (
    <MainLayout>
      <Suspense
        fallback={
          <div className="h-full w-full flex items-center justify-center">
            {/* <Spinner size="xl" /> */}
            (add spinner)
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
    path: '/',
    element: <App />,
    children: [
      { path: '/results', element: <Results /> },
      { path: '/', element: <Home /> },
      { path: '*', element: <Navigate to="." /> },
    ],
  }
];
