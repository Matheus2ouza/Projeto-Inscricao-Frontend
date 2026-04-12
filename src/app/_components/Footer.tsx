export default function Footer() {
  return (
    <footer className="bg-gray-900 px-4 py-12 text-white dark:bg-gray-950">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <h3 className="mb-4 text-2xl font-bold">Sistema de Inscrição</h3>
            <p className="mb-4 text-gray-400">
              Uma plataforma completa para gerenciamento de eventos e
              inscrições, desenvolvida para facilitar a organização e
              participação em Conferência.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-400 transition-colors hover:text-white"
              >
                <i className="bi bi-facebook text-xl"></i>
              </a>
              <a
                href="#"
                className="text-gray-400 transition-colors hover:text-white"
              >
                <i className="bi bi-twitter text-xl"></i>
              </a>
              <a
                href="#"
                className="text-gray-400 transition-colors hover:text-white"
              >
                <i className="bi bi-linkedin text-xl"></i>
              </a>
              <a
                href="#"
                className="text-gray-400 transition-colors hover:text-white"
              >
                <i className="bi bi-instagram text-xl"></i>
              </a>
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-lg font-semibold">Links Úteis</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="#eventos"
                  className="text-gray-400 transition-colors hover:text-white"
                >
                  Eventos
                </a>
              </li>
              <li>
                <a
                  href="#sobre"
                  className="text-gray-400 transition-colors hover:text-white"
                >
                  Sobre
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 transition-colors hover:text-white"
                >
                  Contato
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-lg font-semibold">Contato</h4>
            <div className="space-y-2 text-gray-400">
              <div className="flex items-center">
                <i className="bi bi-phone mr-2"></i>
                <span>(91) 99258-7483</span>
              </div>
              <div className="flex items-center">
                <i className="bi bi-geo-alt mr-2"></i>
                <span>Belém, PA - Brasil</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-800 pt-8 text-center text-gray-400">
          <p>&copy; 2025 Sistema de Inscrição. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
