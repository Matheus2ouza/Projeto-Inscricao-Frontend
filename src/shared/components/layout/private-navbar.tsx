'use client';

import { Button } from '@/shared/components/ui';
import Logo from '@/shared/components/ui/logo';
import { ModeToggle } from '@/shared/components/ui/mode-toggle';
import { SidebarTrigger } from '@/shared/components/ui/sidebar';
import { generateGradientClass } from '@/shared/utils/generateGradient';
import { LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export function PrivateNavbar() {
  const handleLogout = async () => {
    const router = useRouter();
    await signOut({ redirect: false });
    router.replace('/login');
  };

  return (
    <header className="sticky top-4 z-50 mx-auto w-full px-4">
      <nav className="navbar-glass flex h-14 items-center justify-between rounded-xl px-3 shadow-xl shadow-black/10 backdrop-blur-2xl md:h-16 md:px-4">
        {/* Left Section */}
        <div className="flex items-center space-x-3">
          <SidebarTrigger />
          <div className="flex cursor-pointer items-center space-x-3 transition-opacity duration-200 select-none hover:opacity-90">
            <Logo className="h-12 w-12 object-contain" showTitle={false} />
            <h1 className="hidden truncate text-lg font-bold tracking-[0.2em] text-gray-900 uppercase sm:block sm:text-xl lg:text-2xl dark:text-white">
              Sistema de{' '}
              <span
                className={`bg-gradient-to-r ${generateGradientClass()} bg-clip-text text-transparent`}
              >
                Inscrições
              </span>
            </h1>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4 sm:space-x-6">
          {/* Logout - Desktop */}
          <Button
            onClick={() => handleLogout()}
            variant={'secondary'}
            className="hidden cursor-pointer items-center gap-2 rounded-4xl bg-gradient-to-r px-6 py-2 font-medium text-black transition-all duration-200 active:scale-95 md:flex dark:text-white"
          >
            <LogOut className="h-4 w-4" />
            <span>Sair</span>
          </Button>

          {/* Logout - Mobile (ícone apenas) */}
          <Button
            onClick={() => handleLogout()}
            size={'icon'}
            className="flex cursor-pointer items-center justify-center rounded-4xl bg-gradient-to-r p-2 text-black transition-all duration-200 active:scale-95 md:hidden dark:text-white"
            aria-label="Sair"
          >
            <LogOut className="h-4 w-4" />
          </Button>

          <ModeToggle />
        </div>
      </nav>
    </header>
  );
}
