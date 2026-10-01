import { QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router-dom';

import { queryClient } from './lib/query/query-client';
import { router } from './router';

import { ThemeProvider } from './components/theme-provider';
import { AuthProvider } from './lib/auth/auth-context';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme='dark' storageKey='helpy-theme'>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
