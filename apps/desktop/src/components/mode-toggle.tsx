import { Monitor, Moon, Sun } from 'lucide-react';

import { Button } from '@repo/ui/components/ui/button';

import { useTheme } from './theme-provider';

export function ModeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className='flex items-center gap-2'>
      <Button
        variant={theme === 'light' ? 'default' : 'outline'}
        size='icon'
        onClick={() => setTheme('light')}
        aria-label='Use light theme'
      >
        <Sun className='size-4' />
      </Button>

      <Button
        variant={theme === 'dark' ? 'default' : 'outline'}
        size='icon'
        onClick={() => setTheme('dark')}
        aria-label='Use dark theme'
      >
        <Moon className='size-4' />
      </Button>

      <Button
        variant={theme === 'system' ? 'default' : 'outline'}
        size='icon'
        onClick={() => setTheme('system')}
        aria-label='Use system theme'
      >
        <Monitor className='size-4' />
      </Button>
    </div>
  );
}
