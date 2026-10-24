import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

import type { AuthChangeEvent, Session, User } from '@supabase/supabase-js';

import { supabase } from '../supabase/supabase-client';

type AuthContextValue = {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  authError: string | null;
  retryAuth: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function getErrorMessage(error: unknown) {
  return error instanceof Error
    ? error.message
    : 'Unable to verify your authentication. Please check your network connection.';
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  const retryAuth = useCallback(async () => {
    setIsLoading(true);
    setAuthError(null);

    try {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        throw error;
      }

      setSession(data.session);
    } catch (error) {
      console.error('Failed to load auth session:', error);
      setAuthError(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    let authEventHandled = false;

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (event: AuthChangeEvent, nextSession: Session | null) => {
        if (!mounted) return;

        setSession(nextSession);

        // The initial session check below controls the initial loading state.
        if (event === 'INITIAL_SESSION') return;

        authEventHandled = true;
        setAuthError(null);
        setIsLoading(false);
      },
    );

    async function loadSession() {
      try {
        const { data, error } = await supabase.auth.getSession();

        if (!mounted) return;

        if (error) {
          throw error;
        }

        if (!authEventHandled) {
          setSession(data.session);
          setAuthError(null);
        }
      } catch (error) {
        if (!mounted) return;

        console.error('Failed to load auth session:', error);

        if (!authEventHandled) {
          setAuthError(getErrorMessage(error));
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    void loadSession();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('Sign out failed:', error);
      throw error;
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        session,
        user: session?.user ?? null,
        isLoading,
        authError,
        retryAuth,
        signOut: handleSignOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider.');
  }

  return context;
}
