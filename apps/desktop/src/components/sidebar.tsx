import { useState } from 'react';
import {
  BookOpen,
  History,
  LayoutDashboard,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
  User,
} from 'lucide-react';
import { Link, NavLink, useNavigate } from 'react-router-dom';

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
    label: 'Community',
    to: '/community',
    icon: User,
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
  collapsed,
}: {
  label: string;
  to: string;
  icon: typeof LayoutDashboard;
  collapsed: boolean;
}) {
  return (
    <Button
      asChild
      variant='ghost'
      title={collapsed ? label : undefined}
      className={`w-full ${
        collapsed ? 'justify-center px-0' : 'justify-start gap-3'
      }`}
    >
      <NavLink to={to}>
        {({ isActive }) => (
          <>
            <Icon className='size-4 shrink-0' />

            {!collapsed && <span>{label}</span>}

            {!collapsed && isActive && (
              <span className='bg-primary ml-auto size-1.5 rounded-full' />
            )}
          </>
        )}
      </NavLink>
    </Button>
  );
}

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
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
    <aside
      className={`bg-background flex h-screen shrink-0 flex-col border-r transition-[width] duration-200 ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Header */}
      <div
        className={`relative flex h-16 shrink-0 items-center ${
          collapsed ? 'justify-center px-1' : 'justify-between px-4'
        }`}
      >
        <Link
          to='/'
          title='Helpy'
          className={`flex min-w-0 items-center ${
            collapsed ? 'justify-center' : 'gap-2'
          }`}
        >
          <img
            src='./helpy-icon.png'
            alt=''
            className='size-10 shrink-0 object-contain'
          />

          {!collapsed && (
            <h1 className='text-foreground truncate font-medium'>Helpy</h1>
          )}
        </Link>

        <Button
          type='button'
          variant='ghost'
          size='icon'
          onClick={() => setCollapsed((previous) => !previous)}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className={
            collapsed
              ? 'bg-background absolute top-1 -right-7 z-10 size-6'
              : 'size-8 shrink-0'
          }
        >
          {collapsed ? (
            <PanelLeftOpen className='size-4' />
          ) : (
            <PanelLeftClose className='size-4' />
          )}
        </Button>
      </div>

      <Separator />

      {/* Main navigation */}
      <div
        className={`flex min-h-0 flex-1 flex-col py-4 ${collapsed ? 'px-2' : 'px-3'}`}
      >
        <nav className='space-y-1'>
          {mainNavigation.map((item) => (
            <SidebarLink key={item.to} {...item} collapsed={collapsed} />
          ))}
        </nav>

        {/* Bottom section */}
        <div className='mt-auto'>
          {!collapsed && (
            <>
              <Separator className='mb-3' />

              <div className='mb-4'>
                <FocusAudioPlayer />
              </div>
            </>
          )}

          <Separator className='my-3' />

          {/* Profile */}
          <button
            type='button'
            onClick={() => navigate('/profile')}
            title={collapsed ? 'Profile' : undefined}
            className={`hover:bg-accent flex w-full items-center rounded-md py-2 transition-colors ${
              collapsed ? 'justify-center px-0' : 'gap-3 px-3 text-left'
            }`}
          >
            <Avatar className='size-8 shrink-0'>
              <AvatarImage src={avatarUrl} alt={displayName} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>

            {!collapsed && (
              <div className='min-w-0 flex-1'>
                <p className='truncate text-sm font-medium'>{displayName}</p>

                <p className='text-muted-foreground truncate text-xs'>
                  {username ? `@${username}` : user?.email || 'Profile'}
                </p>
              </div>
            )}
          </button>

          {/* Sign out */}
          <Button
            type='button'
            variant='ghost'
            title={collapsed ? 'Sign out' : undefined}
            className={`text-muted-foreground hover:text-foreground mt-1 w-full ${
              collapsed ? 'justify-center px-0' : 'justify-start gap-3'
            }`}
            onClick={handleSignOut}
          >
            <LogOut className='size-4 shrink-0' />

            {!collapsed && <span>Sign out</span>}
          </Button>
        </div>
      </div>
    </aside>
  );
}
