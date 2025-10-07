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
      <div className='fixed top-4 right-4 z-50 flex items-center gap-3'>
        <ThemeToggle />
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

      <AuthModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />

      <Outlet />
    </div>
  );
}

export default Layout;
