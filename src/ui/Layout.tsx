import ThemeToggle from '@ui/ThemeToggle';
import { Outlet } from 'react-router-dom';

function Layout() {
  return (
    <div className='page transition-colors duration-200'>
      <ThemeToggle />
      <Outlet />
    </div>
  );
}

export default Layout;
