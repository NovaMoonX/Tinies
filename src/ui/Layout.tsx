import AuthModal from '@components/AuthModal';
import { useAuth } from '@hooks/useAuth';
import { auth } from '@lib/firebase/firebase.config';
import { Button } from '@moondreamsdev/dreamer-ui/components';
import ThemeToggle from '@ui/ThemeToggle';
import { useState } from 'react';
import { Outlet } from 'react-router-dom';

function Layout() {
  const { user } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await auth.signOut();
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return (
    <div className='page transition-colors duration-200'>
      <div className='bg-background fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-2 shadow-sm md:py-4 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-4 after:bg-gradient-to-b after:from-background after:to-transparent after:pointer-events-none'>
        <ThemeToggle />
        <div className='flex items-center gap-3'>
          {user ? (
            <div className='flex items-center gap-2'>
              <span className='text-sm'>
                Hi, {user.displayName || user.email}
              </span>
              <Button variant='tertiary' onClick={handleLogout}>
                Logout
              </Button>
            </div>
          ) : (
            <Button variant='tertiary' onClick={() => setIsLoginModalOpen(true)}>Log In</Button>
          )}
        </div>
      </div>

      <AuthModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />

      <Outlet />
    </div>
  );
}

export default Layout;
