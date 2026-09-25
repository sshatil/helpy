import { Outlet } from 'react-router-dom';
import { AppSidebar } from '../components/sidebar';

export function AppLayout() {
  return (
    <div className='flex h-screen overflow-hidden bg-background text-foreground'>
      <AppSidebar />

      <main className='min-w-0 flex-1 overflow-y-auto'>
        <div className='mx-auto w-full max-w-7xl p-6'>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
