'use client';

import Logo from '@/shared/components/ui/logo';
import { ModeToggle } from '@/shared/components/ui/mode-toggle';
import { SidebarTrigger } from '@/shared/components/ui/sidebar';
import { useLogout } from '@/shared/hooks/logout/logout';

const PrivateNavbar = () => {
  const { logout } = useLogout();
  return (
    <>
      <nav className="liquid-panel liquid-panel-no-border relative z-50 flex w-full items-center justify-between overflow-hidden border-b px-2 py-3 sm:px-4 lg:px-6">
        {/* Left Section: Sidebar Trigger + Logo + Título */}
        <div className="flex items-center space-x-3">
          {/* Botão para abrir/fechar sidebar */}
          <SidebarTrigger />
          {/* Logo + Título - clicável para voltar à home */}
          <div className="flex items-center space-x-3 transition-opacity duration-200 select-none">
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
          {/* Toggle de Tema */}
          <ModeToggle />
        </div>
      </nav>
    </>
  );
};

export default PrivateNavbar;
