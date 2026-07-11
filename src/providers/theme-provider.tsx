'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import * as React from 'react';

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  const [mounted, setMounted] = React.useState(false);
  const [defaultTheme, setDefaultTheme] = React.useState<'light' | 'dark'>(
    'light',
  );

  React.useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (savedTheme) setDefaultTheme(savedTheme);
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <NextThemesProvider
      {...props}
      defaultTheme={defaultTheme}
      enableSystem={true}
      attribute="class"
    >
      {children}
    </NextThemesProvider>
  );
}
