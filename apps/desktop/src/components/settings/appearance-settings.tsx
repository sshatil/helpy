import { Monitor, Moon, Sun } from 'lucide-react';

import { Button } from '@repo/ui/components/ui/button';
import { useTheme } from '../theme-provider';

export function AppearanceSettings() {
  const { theme, setTheme } = useTheme();

  return (
    <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
      <div className='space-y-1'>
        <h3 className='text-sm font-medium'>Appearance</h3>

        <p className='text-muted-foreground text-sm'>
          Choose how the application looks.
        </p>
      </div>

      <div className='flex items-center rounded-lg border p-1'>
        <Button
          variant={theme === 'light' ? 'default' : 'ghost'}
          size='sm'
          onClick={() => setTheme('light')}
          className='gap-2'
        >
          <Sun className='size-4' />
          <span className='hidden sm:inline'>Light</span>
        </Button>

        <Button
          variant={theme === 'dark' ? 'default' : 'ghost'}
          size='sm'
          onClick={() => setTheme('dark')}
          className='gap-2'
        >
          <Moon className='size-4' />
          <span className='hidden sm:inline'>Dark</span>
        </Button>

        <Button
          variant={theme === 'system' ? 'default' : 'ghost'}
          size='sm'
          onClick={() => setTheme('system')}
          className='gap-2'
        >
          <Monitor className='size-4' />
          <span className='hidden sm:inline'>System</span>
        </Button>
      </div>
    </div>
  );
}
