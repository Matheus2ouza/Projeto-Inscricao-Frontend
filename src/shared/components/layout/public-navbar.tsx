'use client';

import Logo from '@/shared/components/ui/logo';
import { ModeToggle } from '@/shared/components/ui/mode-toggle';
import { generateGradientClass } from '@/shared/utils/generateGradient';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';

const PublicNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleNavigation = (item: string) => {
    setIsMenuOpen(false);

    switch (item) {
      case 'Sobre':
        if (pathname === '/') {
          document
            .getElementById('sobre')
            ?.scrollIntoView({ behavior: 'smooth' });
        } else {
          router.push('/#sobre');
        }
        break;
      case 'Eventos':
        if (pathname === '/') {
          document
            .getElementById('eventos')
            ?.scrollIntoView({ behavior: 'smooth' });
        } else {
          router.push('/#eventos');
        }
        break;
      case 'Login':
        router.push('/login');
        break;
    }
  };

  const handleLoginClick = () => {
    router.push('/login');
  };

  const showNavigationLinks = pathname === '/';

  return (
    <>
      <nav className="navbar-glass relative z-10 mx-auto mt-2 flex w-[95%] items-center justify-between overflow-hidden rounded-3xl px-2 py-3 sm:px-4 lg:px-6">
        {/* Left Section: Menu + Logo + Título */}
        <div className="flex items-center space-x-3">
          {showNavigationLinks && (
            <button
              className="rounded-lg p-2 transition-colors duration-200 hover:bg-white/20 lg:hidden dark:hover:bg-white/10"
              onClick={toggleMenu}
              aria-label={isMenuOpen ? 'Fechar menu' : 'Abrir menu'}
            >
              <div className="flex h-6 w-6 flex-col justify-center space-y-1">
                <span
                  className={`bg-foreground/80 block h-0.5 w-full transition-all duration-300 ${
                    isMenuOpen ? 'translate-y-1.5 rotate-45' : ''
                  }`}
                ></span>
                <span
                  className={`bg-foreground/80 block h-0.5 w-full transition-all duration-300 ${
                    isMenuOpen ? 'opacity-0' : ''
                  }`}
                ></span>
                <span
                  className={`bg-foreground/80 block h-0.5 w-full transition-all duration-300 ${
                    isMenuOpen ? '-translate-y-1.5 -rotate-45' : ''
                  }`}
                ></span>
              </div>
            </button>
          )}

          <Link
            href="/"
            className="flex cursor-pointer items-center space-x-3 transition-opacity duration-200 hover:opacity-90"
          >
            <Logo className="h-12 w-12 object-contain" showTitle={false} />
            <h1 className="hidden truncate text-lg font-bold tracking-[0.2em] text-gray-900 uppercase sm:block sm:text-xl lg:text-2xl dark:text-white">
              Sistema de{' '}
              <span
                className={`bg-gradient-to-r ${generateGradientClass()} bg-clip-text text-transparent`}
              >
                Inscrições
              </span>
            </h1>
          </Link>
        </div>

        <div className="flex items-center space-x-4 sm:space-x-6">
          {showNavigationLinks && (
            <div className="hidden items-center space-x-6 lg:flex">
              <button
                onClick={() => handleNavigation('Eventos')}
                className="group relative font-medium text-gray-700 transition-colors duration-200 hover:text-[#3FB5AE] dark:text-gray-300 dark:hover:text-[#4AB0A8]"
              >
                Eventos
                <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-[#3FB5AE] transition-all duration-300 group-hover:w-full dark:bg-[#4AB0A8]" />
              </button>
            </div>
          )}

          {pathname !== '/login' && (
            <div className="hidden items-center md:flex">
              <button
                onClick={handleLoginClick}
                className={`cursor-pointer rounded-4xl bg-gradient-to-r px-6 py-2 font-medium text-white transition-all duration-200 hover:scale-105 hover:brightness-95 active:scale-95 ${generateGradientClass()}`}
              >
                Login
              </button>
            </div>
          )}

          <ModeToggle />
        </div>
      </nav>

      {showNavigationLinks && isMenuOpen && (
        <div className="liquid-panel relative z-50 mx-auto mt-1 w-[95%] rounded-t-none rounded-b-3xl">
          <div className="space-y-1 px-4 py-3">
            <button
              onClick={() => handleNavigation('Eventos')}
              className="block w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium text-gray-700 transition-colors duration-200 hover:bg-white/20 hover:text-[#3FB5AE] dark:text-gray-300 dark:hover:bg-white/10 dark:hover:text-[#4AB0A8]"
            >
              Eventos
            </button>
            <button
              onClick={() => handleNavigation('Login')}
              className="block w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium text-[#3FB5AE] transition-colors duration-200 hover:bg-white/20 dark:text-[#4AB0A8] dark:hover:bg-white/10"
            >
              Login
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default PublicNavbar;
