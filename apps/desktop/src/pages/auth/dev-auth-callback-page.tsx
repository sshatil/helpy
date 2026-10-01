import { useEffect, useState } from 'react';

export function DevAuthCallbackPage() {
  const [url, setUrl] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Reconstruct the deep link URL using the parameters from this browser URL
    const params = window.location.search || window.location.hash;
    setUrl(`helpy://auth/callback${params}`);
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  return (
    <div className='flex min-h-screen flex-col items-center justify-center p-6 bg-background text-foreground'>
      <div className='w-full max-w-md space-y-6 text-center'>
        <div className='space-y-2'>
          <h1 className='text-2xl font-semibold'>Dev Mode Auth</h1>
          <p className='text-muted-foreground text-sm'>
            Because you are in development mode, the OS deep link cannot be routed automatically.
          </p>
        </div>

        <div className='p-4 bg-muted rounded-lg break-all text-left text-xs font-mono'>
          {url}
        </div>

        <button
          onClick={handleCopy}
          className='w-full py-2 px-4 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors'
        >
          {copied ? 'Copied to clipboard!' : 'Copy Deep Link'}
        </button>

        <p className='text-sm mt-4'>
          Now go back to the Helpy desktop app and paste this link into the Dev Mode input box at the bottom of the login screen.
        </p>
      </div>
    </div>
  );
}
