'use client';

export default function SobreSection() {
  return (
    <section
      id="sobre"
      className="flex min-h-screen items-center justify-center bg-white/50 px-4 backdrop-blur-sm dark:bg-gray-800/50"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <h2 className="mb-6 text-4xl font-bold text-gray-900 md:text-5xl dark:text-white">
            Sobre o Sistema
          </h2>
          <p className="mx-auto max-w-3xl text-xl text-gray-600 dark:text-gray-300">
            Uma solução completa para gerenciamento de eventos e inscrições
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          <div className="rounded-2xl bg-white/80 p-6 text-center shadow-lg transition-all duration-300 hover:shadow-xl dark:bg-gray-900/80">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-purple-500">
              <i className="bi bi-people text-2xl text-white"></i>
            </div>
            <h3 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
              Gestão de Participantes
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Controle completo de inscrições, dados dos participantes e
              confirmações de presença.
            </p>
          </div>

          <div className="rounded-2xl bg-white/80 p-6 text-center shadow-lg transition-all duration-300 hover:shadow-xl dark:bg-gray-900/80">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-green-500 to-blue-500">
              <i className="bi bi-calendar-event text-2xl text-white"></i>
            </div>
            <h3 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
              Organização de Eventos
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Crie e gerencie eventos com facilidade, definindo datas, locais e
              muito mais.
            </p>
          </div>

          <div className="rounded-2xl bg-white/80 p-6 text-center shadow-lg transition-all duration-300 hover:shadow-xl dark:bg-gray-900/80">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-red-500">
              <i className="bi bi-graph-up text-2xl text-white"></i>
            </div>
            <h3 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
              Relatórios e Analytics
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Acompanhe métricas importantes e gere relatórios detalhados dos
              seus eventos.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
