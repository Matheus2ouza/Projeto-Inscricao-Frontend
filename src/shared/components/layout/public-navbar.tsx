"use client";

import Logo from "@/shared/components/ui/logo";
import { ModeToggle } from "@/shared/components/ui/mode-toggle";
import { Button } from "@heroui/react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const PublicNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogoClick = () => {
    router.push("/");
  };

  const handleNavigation = (item: string) => {
    setIsMenuOpen(false);

    switch (item) {
      case "Sobre":
        if (pathname === "/") {
          document
            .getElementById("sobre")
            ?.scrollIntoView({ behavior: "smooth" });
        } else {
          router.push("/#sobre");
        }
        break;
      case "Eventos":
        if (pathname === "/") {
          document
            .getElementById("eventos")
            ?.scrollIntoView({ behavior: "smooth" });
        } else {
          router.push("/#eventos");
        }
        break;
      case "Login":
        router.push("/login");
        break;
    }
  };

  const handleLoginClick = () => {
    router.push("/login");
  };

  // Determina se deve mostrar os links de navegação (apenas na home)
  const showNavigationLinks = pathname === "/";

  return (
    <>
      <nav className="flex justify-between items-center px-2 sm:px-4 lg:px-6 py-3 bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700 w-full overflow-hidden relative z-2">
        {/* Left Section: Menu + Logo + Título */}
        <div className="flex items-center space-x-3">
          {/* Mobile Menu Toggle - apenas na home */}
          {showNavigationLinks && (
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
              onClick={toggleMenu}
              aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
            >
              <div className="w-6 h-6 flex flex-col justify-center space-y-1">
                <span
                  className={`block h-0.5 w-full bg-gray-700 dark:bg-gray-300 transition-all duration-300 ${
                    isMenuOpen ? "rotate-45 translate-y-1.5" : ""
                  }`}
                ></span>
                <span
                  className={`block h-0.5 w-full bg-gray-700 dark:bg-gray-300 transition-all duration-300 ${
                    isMenuOpen ? "opacity-0" : ""
                  }`}
                ></span>
                <span
                  className={`block h-0.5 w-full bg-gray-700 dark:bg-gray-300 transition-all duration-300 ${
                    isMenuOpen ? "-rotate-45 -translate-y-1.5" : ""
                  }`}
                ></span>
              </div>
            </button>
          )}

          {/* Logo + Título - clicável para voltar à home */}
          <div
            className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity duration-200"
            onClick={handleLogoClick}
          >
            <Logo className="w-12 h-12 object-contain" showTitle={false} />
            <h1 className="hidden sm:block text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white truncate tracking-[0.2em] uppercase">
              Sistema de Inscrições
            </h1>
          </div>
        </div>

        {/* Right Section: Desktop Navigation + Actions + Toggle de Tema */}
        <div className="flex items-center space-x-6">
          {/* Desktop Navigation - apenas na home */}
          {showNavigationLinks && (
            <div className="hidden lg:flex items-center space-x-8">
              <button
                onClick={() => handleNavigation("Sobre")}
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors duration-200 relative group"
              >
                Sobre
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 dark:bg-blue-400 transition-all duration-200 group-hover:w-full"></span>
              </button>
              <button
                onClick={() => handleNavigation("Eventos")}
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors duration-200 relative group"
              >
                Eventos
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 dark:bg-blue-400 transition-all duration-200 group-hover:w-full"></span>
              </button>
            </div>
          )}

          {/* Desktop Login/Signup - apenas se não estiver na página de login */}
          {pathname !== "/login" && (
            <div className="hidden md:flex items-center">
              <Button
                color="primary"
                variant="solid"
                onClick={handleLoginClick}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Login
              </Button>
            </div>
          )}

          {/* Toggle de Tema */}
          <ModeToggle />
        </div>
      </nav>

      {/* Mobile Menu - apenas na home */}
      {showNavigationLinks && isMenuOpen && (
        <div className="lg:hidden bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-lg">
          <div className="px-4 py-2 space-y-1">
            {["Sobre", "Eventos", "Documentação", "Login"].map(
              (item, index) => (
                <button
                  key={`${item}-${index}`}
                  onClick={() => handleNavigation(item)}
                  className={`block w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    item === "Login"
                      ? "text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400"
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
