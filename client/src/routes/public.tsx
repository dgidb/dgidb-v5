import { Suspense } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

import Home from 'pages/home/home.page';
import { Results } from 'pages/results';
import { MainLayout } from 'components/Layout';
// import { lazyImport } from '@/utils/lazyImport';

// const { DiscussionsRoutes } = lazyImport(
//   () => import('@/features/discussions'),
//   'DiscussionsRoutes'
// );
// const { Dashboard } = lazyImport(() => import('@/features/misc'), 'Dashboard');
// const { Profile } = lazyImport(() => import('@/features/users'), 'Profile');
// const { Users } = lazyImport(() => import('@/features/users'), 'Users');

const App = () => {
  return (
    <MainLayout>

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
  },
];
