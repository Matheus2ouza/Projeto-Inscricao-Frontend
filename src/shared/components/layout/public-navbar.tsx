'use client';

import Logo from '@/shared/components/ui/logo';
import { ModeToggle } from '@/shared/components/ui/mode-toggle';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';

const PublicNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogoClick = () => {
    router.push('/');
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

  // Determina se deve mostrar os links de navegação (apenas na home)
  const showNavigationLinks = pathname === '/';

  return (
    <>
      <nav className="liquid-panel relative z-2 mx-auto mt-2 flex w-[95%] items-center justify-between overflow-hidden border-x-5 border-t-0 px-2 py-3 sm:px-4 lg:px-6">
        {/* Left Section: Menu + Logo + Título */}
        <div className="flex items-center space-x-3">
          {/* Mobile Menu Toggle - apenas na home */}
          {showNavigationLinks && (
            <button
              className="rounded-lg p-2 transition-colors duration-200 hover:bg-gray-100 lg:hidden dark:hover:bg-gray-800"
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

          {/* Logo + Título - clicável para voltar à home */}
          <div
            className="flex cursor-pointer items-center space-x-3 transition-opacity duration-200 hover:opacity-90"
            onClick={handleLogoClick}
          >
            <Logo className="h-12 w-12 object-contain" showTitle={false} />
            <h1 className="hidden truncate text-lg font-bold tracking-[0.2em] text-gray-900 uppercase sm:block sm:text-xl lg:text-2xl dark:text-white">
              Sistema de{' '}
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Inscrições
              </span>
            </h1>
          </div>
        </div>

        {/* Right Section: Desktop Navigation + Actions + Toggle de Tema */}
        <div className="flex items-center space-x-6">
          {/* Desktop Navigation - apenas na home */}
          {showNavigationLinks && (
            <div className="hidden items-center space-x-8 lg:flex">
              {/* <button
                onClick={() => handleNavigation('Sobre')}
                className="group relative font-medium text-gray-700 transition-colors duration-200 hover:text-blue-600 dark:text-gray-300 dark:hover:text-white"
              >
                Sobre
              </button> */}

              <button
                onClick={() => handleNavigation('Eventos')}
                className="group relative font-medium text-gray-700 transition-colors duration-200 hover:text-blue-600 dark:text-gray-300 dark:hover:text-white"
              >
                Eventos
              </button>
            </div>
          )}

          {/* Desktop Login/Signup - apenas se não estiver na página de login */}
          {pathname !== '/login' && (
            <div className="hidden items-center md:flex">
              <button
                onClick={handleLoginClick}
                className="text-primary-foreground cursor-pointer rounded-4xl bg-indigo-600 px-6 py-2 font-medium transition duration-200 hover:brightness-90 dark:bg-white dark:text-neutral-900 dark:hover:bg-gray-200"
              >
                Login
              </button>
            </div>
          )}

          {/* Toggle de Tema */}
          <ModeToggle />
        </div>
      </nav>

      {/* Mobile Menu - apenas na home */}
      {showNavigationLinks && isMenuOpen && (
        <div className="liquid-panel-strong mt-1 rounded-t-none border-x-0 lg:hidden">
          <div className="space-y-1 px-4 py-2">
            {['Sobre', 'Eventos', 'Documentação', 'Login'].map(
              (item, index) => (
                <button
                  key={`${item}-${index}`}
                  onClick={() => handleNavigation(item)}
                  className={`block w-full rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors duration-200 ${
                    item === 'Login'
                      ? 'text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-blue-400'
                  }`}
                >
                  {item}
                </button>
              ),
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default PublicNavbar;
