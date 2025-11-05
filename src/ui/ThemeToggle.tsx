import { useTheme } from '@moondreamsdev/dreamer-ui/hooks';
import { Moon, Sun } from '@moondreamsdev/dreamer-ui/symbols';

function ThemeToggle() {
  const { toggleTheme, theme } = useTheme();
  const Icon = theme === 'dark' ? Sun : Moon;

  return (
    <button
      onClick={toggleTheme}
      className='focus:ring-foreground/80 hover:bg-foreground/10 rounded-lg p-3 transition-all duration-200 focus:ring focus:outline-none'
      aria-label='Toggle theme'
    >
      <Icon className='text-foreground size-5' />
    </button>
  );
}

export default ThemeToggle;
