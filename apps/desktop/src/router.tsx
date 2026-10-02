import { Navigate, createBrowserRouter } from 'react-router-dom';

import { AppLayout } from './layouts/app-layout';

import DashboardPage from './pages/dashboard-page';
import PlansPage from './pages/plans-page';
import PlanDetailsPage from './pages/plan-details-page';
import HistoryPage from './pages/history-page';
import SettingsPage from './pages/settings-page';
import { GoogleLoginPage } from './pages/auth/google-login-page';
import { DevAuthCallbackPage } from './pages/auth/dev-auth-callback-page';
import { ProtectedRoute } from './components/protected-route';
import ProfilePage from './pages/profile-page';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <GoogleLoginPage />,
  },
  {
    path: '/auth/callback',
    element: <DevAuthCallbackPage />,
  },

  {
    element: <ProtectedRoute />,
    children: [
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
          {
            path: 'settings',
            element: <SettingsPage />,
          },
          {
            path: 'profile',
            element: <ProfilePage />,
          },
        ],
      },
    ],
  },
]);
