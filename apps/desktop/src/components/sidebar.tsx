import {
  BookOpen,
  History,
  LayoutDashboard,
  LogOut,
  Settings,
  User,
} from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';

import { Button } from '@repo/ui/components/ui/button';
import { Separator } from '@repo/ui/components/ui/separator';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@repo/ui/components/ui/avatar';

import { FocusAudioPlayer } from './focus-audio/focus-audio-player';

import { useAuth } from '../lib/auth/auth-context';
import { signOut } from '../lib/auth/auth-repository';
import { useProfile } from '../hooks/use-profile';

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
  {
    label: 'Settings',
    to: '/settings',
    icon: Settings,
  },
];

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) {
    return 'HU';
  }

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

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
  const navigate = useNavigate();

  const { user } = useAuth();
  const { data: profile } = useProfile();

  async function handleSignOut() {
    try {
      await signOut();
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Failed to sign out:', error);
    }
  }

  const displayName =
    profile?.displayName || user?.user_metadata?.full_name || 'Helpy User';

  const username = profile?.username;

  const avatarUrl = profile?.avatarUrl || user?.user_metadata?.avatar_url;

  const initials = getInitials(displayName || user?.email || 'Helpy User');

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

          {/* <Separator className='mb-3' />

          <nav className='space-y-1'>
            {secondaryNavigation.map((item) => (
              <SidebarLink key={item.to} {...item} />
            ))}
          </nav> */}

          <Separator className='my-3' />

          <div className='space-y-1'>
            <button
              type='button'
              onClick={() => navigate('/profile')}
              className='hover:bg-accent flex w-full items-center gap-3 rounded-md px-3 py-2 text-left transition-colors'
            >
              <Avatar className='size-8 shrink-0'>
                <AvatarImage src={avatarUrl} alt={displayName} />

                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>

              <div className='min-w-0 flex-1'>
                <p className='truncate text-sm font-medium'>{displayName}</p>

                <p className='text-muted-foreground truncate text-xs'>
                  {username ? `@${username}` : user?.email || 'Profile'}
                </p>
              </div>
            </button>

            <Button
              type='button'
              variant='ghost'
              className='text-muted-foreground hover:text-foreground w-full justify-start gap-3'
              onClick={handleSignOut}
            >
              <LogOut className='size-4' />

              <span>Sign out</span>
            </Button>
          </div>
        </div>
      </div>
    </aside>
  );
}
