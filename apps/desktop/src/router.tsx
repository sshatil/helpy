import { Navigate, createBrowserRouter } from 'react-router-dom';
import { AppLayout } from './layouts/app-layout';
import DashboardPage from './pages/dashboard-page';

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
    ],
  },
]);
