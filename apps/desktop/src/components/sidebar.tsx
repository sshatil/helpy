import {
  BookOpen,
  History,
  LayoutDashboard,
  Settings,
  User,
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { Button } from '@repo/ui/components/ui/button';
import { Separator } from '@repo/ui/components/ui/separator';
import { FocusAudioPlayer } from './focus-audio/focus-audio-player';

const mainNavigation = [
  {
    label: 'Dashboard',
    to: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    label: 'Study / Work',
    to: '/study/plans',
    icon: BookOpen,
  },
  {
    label: 'History',
    to: '/history',
    icon: History,
  },
];

const secondaryNavigation = [
  {
    label: 'Profile',
    to: '/profile',
    icon: User,
  },
  {
    label: 'Settings',
    to: '/settings',
    icon: Settings,
  },
];

function SidebarLink({
  label,
  to,
  icon: Icon,
}: {
  label: string;
  to: string;
  icon: typeof LayoutDashboard;
}) {
  return (
    <Button asChild variant='ghost' className='w-full justify-start gap-3'>
      <NavLink to={to}>
        {({ isActive }) => (
          <>
            <Icon className='size-4' />

            <span>{label}</span>

            {isActive && (
              <span className='bg-primary ml-auto size-1.5 rounded-full' />
            )}
          </>
        )}
      </NavLink>
    </Button>
  );
}

export function AppSidebar() {
  return (
    <aside className='bg-background flex h-screen w-64 shrink-0 flex-col border-r'>
      <div className='flex h-16 items-center px-6'>
        <span className='text-lg font-semibold'>Productivity</span>
      </div>

      <Separator />

      <div className='flex flex-1 flex-col px-3 py-4'>
        <nav className='space-y-1'>
          {mainNavigation.map((item) => (
            <SidebarLink key={item.to} {...item} />
          ))}
        </nav>

        <div className='mt-auto'>
          <Separator className='mb-3' />
          <div className='mb-4'>
            <FocusAudioPlayer />
          </div>

          <Separator className='mb-3' />

          <nav className='space-y-1'>
            {secondaryNavigation.map((item) => (
              <SidebarLink key={item.to} {...item} />
            ))}
          </nav>
        </div>
      </div>
    </aside>
  );
}
