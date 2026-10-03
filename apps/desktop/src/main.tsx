import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { TooltipProvider } from '@repo/ui/components/ui/tooltip';
import { initializeOAuthCallback } from './pages/auth/oauth-callback';
import { AppErrorBoundary } from './components/app-error-boundary';

void initializeOAuthCallback().catch((error) => {
  console.error('Failed to initialize OAuth callback:', error);
});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <TooltipProvider>
      <AppErrorBoundary>
        <App />
      </AppErrorBoundary>
    </TooltipProvider>
  </React.StrictMode>,
);
