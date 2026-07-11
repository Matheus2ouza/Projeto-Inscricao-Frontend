'use client';

import { Button } from '@/shared/components/ui/button';
import { Monitor, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export function ModeToggle() {
  const { theme, setTheme } = useTheme();
  const [isSwitching, setIsSwitching] = useState(false);

  const cycleTheme = () => {
    if (!theme || theme === 'system') {
      setTheme('light');
    } else if (theme === 'light') {
      setTheme('dark');
    } else {
      setTheme('system');
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => setIsSwitching(false), 260);
    return () => clearTimeout(timer);
  }, [theme]);

  const renderIcon = () => {
    if (theme === 'light') {
      return <Sun className="h-[1.2rem] w-[1.2rem]" />;
    }
    if (theme === 'dark') {
      return <Moon className="h-[1.2rem] w-[1.2rem]" />;
    }
    return <Monitor className="h-[1.2rem] w-[1.2rem]" />;
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={cycleTheme}
      className="liquid-glass-button"
    >
      <span
        className={`transition-all duration-300 ${
          isSwitching
            ? 'scale-75 rotate-90 opacity-0'
            : 'scale-100 rotate-0 opacity-100'
        }`}
      >
        {renderIcon()}
      </span>
      <span className="sr-only">Alternar tema</span>
    </Button>
  );
}
