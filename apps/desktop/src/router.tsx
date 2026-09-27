import { Navigate, createBrowserRouter } from 'react-router-dom';
import { AppLayout } from './layouts/app-layout';
import DashboardPage from './pages/dashboard-page';
import PlansPage from './pages/plans-page';
import PlanDetailsPage from './pages/plan-details-page';
import HistoryPage from './pages/history-page';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <Navigate to='/dashboard' replace />,
      },
      {
        path: 'dashboard',
        element: <DashboardPage />,
      },
      {
        path: 'study/plans',
        element: <PlansPage />,
      },
      {
        path: 'study/plans/:planId',
        element: <PlanDetailsPage />,
      },
      {
        path: 'history',
        element: <HistoryPage />,
      },
    ],
  },
]);
