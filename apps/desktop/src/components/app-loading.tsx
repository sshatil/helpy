import { LoaderCircle } from 'lucide-react';

export function AppLoading() {
  return (
    <div className='bg-background text-foreground flex min-h-screen flex-col items-center justify-center gap-4'>
      <div className='flex items-center justify-center rounded-2xl'>
        <img
          src='/helpy-icon.png'
          alt='Helpy'
          className='size-20 object-contain'
        />
      </div>

      <div className='space-y-2 text-center'>
        <h1 className='text-xl font-semibold tracking-tight'>Helpy</h1>

        <p className='text-muted-foreground text-sm'>Getting things ready...</p>
      </div>

      <LoaderCircle className='text-muted-foreground mt-2 size-5 animate-spin' />
    </div>
  );
}
