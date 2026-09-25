import { Navigate, createBrowserRouter } from 'react-router-dom';
import { AppLayout } from './layouts/app-layout';
import DashboardPage from './pages/dashboard-page';
import StudyPage from './pages/study-page';

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
        path: 'study',
        element: <StudyPage />,
      },
      {
        path: 'study/plans',
        element: <StudyPage />,
      },

      {
        path: 'study/plans/new',
        element: <StudyPage />,
      },
    ],
  },
]);
