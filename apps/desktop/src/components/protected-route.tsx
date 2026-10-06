import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { useAuth } from '../lib/auth/auth-context';
import { AppLoading } from './app-loading';

export function ProtectedRoute() {
  const { user, isLoading } = useAuth();

  const location = useLocation();

  if (isLoading) {
    return <AppLoading />;
  }

  if (!user) {
    return (
      <Navigate
        to='/login'
        replace
        state={{
          from: location.pathname,
        }}
      />
    );
  }

  return <Outlet />;
}
