import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { useAuth } from '../lib/auth/auth-context';

export function ProtectedRoute() {
  const { user, isLoading } = useAuth();

  const location = useLocation();

  if (isLoading) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        Loading...
      </div>
    );
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
