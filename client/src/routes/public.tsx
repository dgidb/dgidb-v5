import { Suspense, useEffect } from 'react';
import { Navigate, Outlet, useLocation, useRoutes } from 'react-router-dom';

import { Home } from 'pages/Home';
import { Results } from 'pages/Results';
import { BrowseSources } from 'components/Browse/Sources';
import { BrowseCategories } from 'components/Browse/Categories';
import { GeneRecord, GeneRecordContainer } from 'components/Gene/GeneRecord';
import { DrugRecord } from 'components/Drug/DrugRecord';

import { MainLayout } from 'components/Layout';
import { About } from 'pages/About';
import { Downloads } from 'pages/Downloads';
import { API } from 'pages/API';
import { InteractionRecord } from 'components/Interaction/InteractionRecord';

const App = () => {
  const { pathname, hash, key } = useLocation();

  useEffect(() => {
    // if not a hash link, scroll to top
    if (hash === '') {
      window.scrollTo(0, 0);
    }
    // else scroll to id
    else {
      setTimeout(() => {
        const id = hash.replace('#', '');
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView();
        }
      }, 0);
    }
  }, [pathname, hash, key]);

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

export const Routes = () => {
  const publicRoutes = [
    {
      path: '/',
      element: <App />,
      children: [
        {
          path: 'genes',
          element: <GeneRecordContainer />,
          children: [
            {
              path: ':gene',
              element: <GeneRecord />,
            },
          ],
        },
        {
          path: 'drugs',
          element: <DrugRecord />,
          children: [
            {
              path: ':drug',
              element: <DrugRecord />,
            },
          ],
        },
        {
          path: '/interactions',
          element: <InteractionRecord />,
          children: [
            {
              path: ':id',
              element: <InteractionRecord />,
            },
          ],
        },
        { path: '/results', element: <Results /> },
        { path: '/browse/categories', element: <BrowseCategories /> },
        { path: '/browse/sources', element: <BrowseSources /> },
        { path: '/about', element: <About /> },
        { path: '/downloads', element: <Downloads /> },
        { path: '/api', element: <API /> },
        { path: '/', element: <Home /> },
        { path: '*', element: <Navigate to="." /> },
      ],
    },
  ];

  const element = useRoutes(publicRoutes);

  return <>{element}</>;
};
