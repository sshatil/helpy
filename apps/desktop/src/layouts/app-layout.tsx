import { NavLink, Outlet } from 'react-router-dom';

const navigation = [
  {
    label: 'Dashboard',
    to: '/dashboard',
  },
  {
    label: 'Study / Work',
    to: '/study',
  },
  {
    label: 'History',
    to: '/history',
  },
  {
    label: 'Profile',
    to: '/profile',
  },
  {
    label: 'Settings',
    to: '/settings',
  },
];

export function AppLayout() {
  return (
    <div className='min-h-screen'>
      <header className='border-b'>
        <nav className='flex items-center gap-6 px-6 py-4'>
          <div className='font-semibold'>Productivity App</div>

          <div className='flex items-center gap-4'>
            {navigation.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  isActive ? 'font-medium underline' : 'text-muted-foreground'
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        </nav>
      </header>

      <main className='p-6'>
        <Outlet />
      </main>
    </div>
  );
}
