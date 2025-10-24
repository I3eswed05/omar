import { Moon, Sun } from 'lucide-react';
import { Button } from './ui/button';
import { useAppStore } from '../store/app-store';
import { Language, t } from '../lib/i18n';

export function ThemeToggle({ language }: { language: Language }) {
  const theme = useAppStore((state) => state.theme);
  const setTheme = useAppStore((state) => state.setTheme);

  const isDark = theme === 'dark';

  const handleToggle = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  return (
    <Button
      onClick={handleToggle}
      variant="ghost"
      size="icon"
      className="rounded-full"
      aria-label={isDark ? t('light_mode', language) : t('dark_mode', language)}
      title={isDark ? t('light_mode', language) : t('dark_mode', language)}
    >
      {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </Button>
  );
}
