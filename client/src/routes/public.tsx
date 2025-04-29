import { Suspense, useEffect } from 'react';
import { Outlet, useLocation, useRoutes } from 'react-router-dom';

import { Home } from 'pages/Home';
import { Results } from 'pages/Results';
import { BrowseSources } from 'components/Browse/Sources';
import { BrowseCategories } from 'components/Browse/Categories';
import { GeneRecord, GeneRecordContainer } from 'components/Gene/GeneRecord';
import { DrugRecord } from 'components/Drug/DrugRecord';

import { MainLayout, AboutLayout } from 'components/Layout';
import { Introduction as AboutIntroduction, AboutUs as AboutUs, Clients as AboutClients, AboutStats as AboutStats, InteractionScore as AboutInteractionScore, DataModel as AboutDataModel, Grouping as AboutGrouping, AboutDruggableGenome, AboutDataAccesibility, AboutTypesAndDirectionality, ContactUs as AboutContactUs, Contributing as AboutContributing} from 'pages/About/Overview';
import { Downloads } from 'pages/Downloads';
import { API } from 'pages/API';
import { InteractionRecord } from 'components/Interaction/InteractionRecord';
import { NotFoundError } from 'components/Shared/NotFoundError/NotFoundError';

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
        // { path: '/about', element: <Introduction /> },
        {
          path: '/about/overview',
          element: <AboutLayout />,
          children: [
            {
              index: true,
              element: <AboutIntroduction />
            },
            {
              path: 'introduction',
              element: <AboutIntroduction />
            },
            {
              path: 'about-us',
              element: <AboutUs />
            },
            {
              path: 'clients',
              element: <AboutClients />
            },
            {
              path: 'stats',
              element: <AboutStats />
            },
            {
              path: 'interaction-score',
              element: <AboutInteractionScore />
            },
            {
              path: 'data-model',
              element: <AboutDataModel />
            },
            {
              path: 'grouping',
              element: <AboutGrouping />
            },
            {
              path: 'druggable-genome',
              element: <AboutDruggableGenome />
            },
            {
              path: 'data-accessibility',
              element: <AboutDataAccesibility />
            },
            {
              path: 'types-and-directionality',
              element: <AboutTypesAndDirectionality />
            },
            {
              path: 'contact-us',
              element: <AboutContactUs />
            },
            {
              path: 'contributing',
              element: <AboutContributing />
            }

          ]
        },
        { path: '/downloads', element: <Downloads /> },
        { path: '/api', element: <API /> },
        { path: '/', element: <Home /> },
        {
          path: '*',
          element: (
            <NotFoundError errorMessage="We are unable to find the page you are looking for." />
          ),
        },
      ],
    },
  ];

  const element = useRoutes(publicRoutes);

  return <>{element}</>;
};
