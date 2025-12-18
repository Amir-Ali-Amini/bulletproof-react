import { Outlet } from 'react-router-dom';

import { DashboardLayout } from '@/components/layouts/dashboard-layout';
import PaymentsPage from '@/components/pages/payment';

export const ErrorBoundary = () => {
  return <div>Something went wrong!</div>;
};

const AppRoot = () => {
  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
};

export default AppRoot;
