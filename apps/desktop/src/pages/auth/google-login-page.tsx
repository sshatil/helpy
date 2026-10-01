import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { openUrl } from '@tauri-apps/plugin-opener';

import { signInWithGoogle } from '../../lib/auth/auth-repository';
import { useAuth } from '../../lib/auth/auth-context';

import { Button } from '@repo/ui/components/ui/button';

const AUTH_TIMEOUT_MS = 90_000;

export function GoogleLoginPage() {
  const { user, isLoading: isAuthLoading } = useAuth();

  const navigate = useNavigate();

  const [isSigningIn, setIsSigningIn] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Redirect to dashboard when the user is authenticated.
  useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  // Clean up timeout on unmount.
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  async function handleGoogleLogin() {
    try {
      setIsSigningIn(true);
      setError(null);

      const url = await signInWithGoogle();

      await openUrl(url);

      // Set a timeout so the user is not stuck forever if the callback
      // never arrives (e.g. they close the browser tab).
      timeoutRef.current = setTimeout(() => {
        setIsSigningIn(false);
        setError(
          'Sign-in timed out. Please try again.',
        );
      }, AUTH_TIMEOUT_MS);
    } catch (err) {
      console.error('Google sign-in failed:', err);

      setError(
        err instanceof Error
          ? err.message
          : 'Unable to sign in with Google.',
      );

      setIsSigningIn(false);
    }
  }

  // While the auth context is performing its initial session check, show
  // a minimal loading state.
  if (isAuthLoading) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <p className='text-muted-foreground text-sm'>Loading…</p>
      </div>
    );
  }

  return (
    <div className='flex min-h-screen items-center justify-center p-6'>
      <div className='w-full max-w-sm space-y-6'>
        <div className='space-y-2 text-center'>
          <h1 className='text-2xl font-semibold'>Welcome to Helpy</h1>

          <p className='text-muted-foreground text-sm'>
            Sign in to continue to your workspace.
          </p>
        </div>

        <Button
          className='w-full'
          onClick={handleGoogleLogin}
          disabled={isSigningIn}
        >
          {isSigningIn ? 'Waiting for Google sign-in…' : 'Continue with Google'}
        </Button>

        {error ? (
          <p className='text-destructive text-center text-sm'>{error}</p>
        ) : null}

        {isSigningIn ? (
          <p className='text-muted-foreground text-center text-xs'>
            Complete sign-in in your browser. This page will update
            automatically.
          </p>
        ) : null}

        {/* Dev Mode Fallback: macOS LaunchServices routes deep links to the .app bundle 
            instead of the running tauri:dev instance. This lets developers paste the URL. */}
        {import.meta.env.DEV && isSigningIn ? (
          <div className='mt-8 pt-4 border-t border-border'>
            <p className='text-xs text-muted-foreground mb-2 text-center'>
              Dev Mode: If the app doesn't detect the login, copy the helpy:// URL from your browser and paste it here:
            </p>
            <input
              type='text'
              placeholder='Paste helpy://auth/callback?code=...'
              className='w-full text-xs p-2 rounded bg-background border border-input focus:ring-1 focus:ring-primary outline-none'
              onChange={async (e) => {
                const url = e.target.value;
                if (url.includes('code=')) {
                  try {
                    const parsed = new URL(url);
                    const code = parsed.searchParams.get('code');
                    if (code) {
                      await import('../../lib/supabase/supabase-client').then(({ supabase }) => 
                        supabase.auth.exchangeCodeForSession(code)
                      );
                    }
                  } catch (err) {
                    console.error('Manual code exchange failed', err);
                  }
                }
              }}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}
