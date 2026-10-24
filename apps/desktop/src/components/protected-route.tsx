import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { Button } from '@repo/ui/components/ui/button';

import { useAuth } from '../lib/auth/auth-context';
import { AppLoading } from './app-loading';

export function ProtectedRoute() {
  const { user, isLoading, authError, retryAuth } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <AppLoading />;
  }

  if (authError) {
    return (
      <div className='flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center'>
        <h1 className='text-xl font-semibold'>Unable to connect</h1>

        <p className='text-muted-foreground max-w-md text-sm'>
          We couldn't verify your login session. Check your internet connection
          and try again.
        </p>

        <p className='text-muted-foreground max-w-md text-xs'>{authError}</p>

        <Button onClick={() => void retryAuth()}>Try again</Button>
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
