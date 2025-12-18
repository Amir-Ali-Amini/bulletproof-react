import { useMemo } from 'react';
import {
  Navigate,
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';

import { paths } from '@/config/paths';

import AppRoot, {
  ErrorBoundary as AppRootErrorBoundary,
} from './routes/app/root';
import PaymentRoute from '@/components/pages/payment';
import AddCardRoute from './routes/app/add-card';
import ScanPage from './routes/app/scan';

const toRouteModule = (mod: any) => {
  const { default: Component, ...rest } = mod;
  return {
    ...rest,
    Component,
  };
};

export const createAppRouter = () =>
  createBrowserRouter([
    {
      path: '/',
      element: <Navigate to={paths.app.payment.getHref()} replace />,
    },
    {
      path: paths.app.root.path,
      element: <AppRoot />,
      ErrorBoundary: AppRootErrorBoundary,
      children: [
        {
          index: true,
          element: <Navigate to={paths.app.payment.getHref()} replace />,
        },
        {
          path: paths.app.payment.path,
          element: <PaymentRoute />,
        },
        {
          path: paths.app.addCard.path,
          element: <AddCardRoute />,
        },
        {
          path: paths.app.profile.path,
          lazy: () => import('./routes/app/profile').then(toRouteModule),
        },
        {
          path: paths.app.inPerson.path,
          lazy: () => import('./routes/app/in-person').then(toRouteModule),
        },
        {
          path: paths.app.credits.path,
          lazy: () => import('./routes/app/credits').then(toRouteModule),
        },
        {
          path: paths.app.scan.path,
          element: <ScanPage />,
        },
      ],
    },
    {
      path: '*',
      lazy: () => import('./routes/not-found').then(toRouteModule),
    },
  ]);

export const AppRouter = () => {
  const router = useMemo(() => createAppRouter(), []);

  return <RouterProvider router={router} />;
};
