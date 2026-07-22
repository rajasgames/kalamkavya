import { Sun, Moon } from 'lucide-react';
import { useUIStore } from '@/stores/uiStore';

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className = '' }: ThemeToggleProps) {
  const { theme, setTheme } = useUIStore();

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    // This executes before React completely finishes re-rendering, preventing flicker
    document.documentElement.setAttribute('data-theme', newTheme);
    setTheme(newTheme);
  };

  return (
    <button
      onClick={toggleTheme}
      className={`p-2 rounded-xl text-ghost hover:text-amber-from hover:bg-elevated transition-colors flex items-center justify-center ${className}`}
      title={`Switch to ${theme === 'light' ? 'Midnight' : 'Parchment'} theme`}
      aria-label="Toggle theme"
    >
      {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
    </button>
  );
}
