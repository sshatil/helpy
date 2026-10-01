import { getCurrent, onOpenUrl } from '@tauri-apps/plugin-deep-link';

import { supabase } from '../../lib/supabase/supabase-client';

const AUTH_CALLBACK_PREFIX = 'helpy://auth/callback';

async function handleCallbackUrl(url: string) {
  console.log('[OAuth] Callback received:', url);

  if (!url.startsWith(AUTH_CALLBACK_PREFIX)) {
    return;
  }

  // Parse the callback URL. Supabase may deliver tokens either as
  // query parameters (?code=...) for PKCE or as a hash fragment
  // (#access_token=...) for implicit flow. We normalise both cases.
  const callbackUrl = new URL(url);

  // Check for an error response from the provider.
  const error =
    callbackUrl.searchParams.get('error') ??
    new URLSearchParams(callbackUrl.hash.slice(1)).get('error');

  if (error) {
    const description =
      callbackUrl.searchParams.get('error_description') ??
      new URLSearchParams(callbackUrl.hash.slice(1)).get('error_description') ??
      'Google authentication failed.';

    console.error('[OAuth] Provider error:', { error, description });
    throw new Error(description);
  }

  // --- PKCE flow: exchange the authorization code for a session ---
  const code = callbackUrl.searchParams.get('code');

  if (code) {
    console.log('[OAuth] Exchanging authorization code for session…');

    const { data, error: exchangeError } =
      await supabase.auth.exchangeCodeForSession(code);

    if (exchangeError) {
      console.error('[OAuth] Code exchange failed:', exchangeError);
      throw exchangeError;
    }

    console.log('[OAuth] Session created for:', data.user?.email);
    return;
  }

  // --- Implicit flow fallback: tokens are in the hash fragment ---
  const hashParams = new URLSearchParams(callbackUrl.hash.slice(1));
  const accessToken = hashParams.get('access_token');
  const refreshToken = hashParams.get('refresh_token');

  if (accessToken) {
    console.log('[OAuth] Setting session from implicit flow tokens…');

    const { error: sessionError } = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken ?? '',
    });

    if (sessionError) {
      console.error('[OAuth] setSession failed:', sessionError);
      throw sessionError;
    }

    console.log('[OAuth] Session created from implicit flow.');
    return;
  }

  console.warn(
    '[OAuth] Callback URL contained neither a code nor an access token.',
  );
}

export async function initializeOAuthCallback() {
  // Process any URLs that were used to cold-launch the app.
  try {
    const currentUrls = await getCurrent();

    if (currentUrls) {
      for (const url of currentUrls) {
        try {
          await handleCallbackUrl(url);
        } catch (error) {
          console.error('[OAuth] Startup callback failed:', error);
        }
      }
    }
  } catch (error) {
    console.error('[OAuth] Failed to read startup URLs:', error);
  }

  // Listen for deep links arriving while the app is running.
  return onOpenUrl(async (urls) => {
    for (const url of urls) {
      try {
        await handleCallbackUrl(url);
      } catch (error) {
        console.error('[OAuth] Runtime callback failed:', error);
      }
    }
  });
}
