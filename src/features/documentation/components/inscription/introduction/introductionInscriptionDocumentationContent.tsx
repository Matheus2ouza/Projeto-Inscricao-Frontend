import Image from "next/image";
import Link from "next/link";

export default function IntroductionInscriptionDocumentationContent() {
  return (
    <div className="space-y-6 text-gray-700 dark:text-gray-300 px-4 sm:px-0">
      <div className="space-y-8">
        <div className="space-y-4">
          <div className="space-y-2">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
              Introdução
            </h2>
            <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300">
              O Sistema de Inscrição disponibiliza dois fluxos de inscrição:{" "}
              <strong>Individual</strong> e <strong>Em Grupo</strong>. Cada
              fluxo foi pensado para atender diferentes cenários de participação
              em eventos. A seguir, veja como funciona cada modalidade:
            </p>
          </div>

          {/* Inscrição Individual */}
          <div className="bg-white dark:bg-gray-800/50 p-6 sm:p-8 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                Inscrição Individual
              </h2>
            </div>

            <div className="space-y-6">
              <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                A inscrição individual é destinada a participantes que desejam
                se inscrever em eventos de forma independente. O processo é
                simples e rápido. Para mais detalhes siga para a seção{" "}
                <Link
                  href="/documentation/inscription/individual"
                  className="text-blue-600 dark:text-blue-400 font-semibold underline"
                >
                  Inscrição Individual
                </Link>
                .
              </p>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mt-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-900/30 border border-gray-100 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-900/50 hover:border-gray-300 dark:hover:border-gray-600 transition-colors">
                    <div className="mt-1 min-w-[24px] h-6 flex items-center justify-center rounded bg-white dark:bg-gray-800 text-xs font-bold text-gray-500 border border-gray-200 dark:border-gray-700 shadow-sm">
                      A
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                        Escolha o Evento
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Na lista de eventos, clique no botão{" "}
                        <strong>"Inscrever-se"</strong> no card do evento
                        desejado.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-900/30 border border-gray-100 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-900/50 hover:border-gray-300 dark:hover:border-gray-600 transition-colors">
                    <div className="mt-1 min-w-[24px] h-6 flex items-center justify-center rounded bg-white dark:bg-gray-800 text-xs font-bold text-gray-500 border border-gray-200 dark:border-gray-700 shadow-sm">
                      B
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                        Selecione o Membro
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Selecione o membro que participará do evento. Se for
                        você, selecione seu próprio nome.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-900/30 border border-gray-100 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-900/50 hover:border-gray-300 dark:hover:border-gray-600 transition-colors">
                    <div className="mt-1 min-w-[24px] h-6 flex items-center justify-center rounded bg-white dark:bg-gray-800 text-xs font-bold text-gray-500 border border-gray-200 dark:border-gray-700 shadow-sm">
                      C
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                        Revise os Dados
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Confira se as informações do evento e do membro estão
                        corretas antes de prosseguir.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-900/30 border border-gray-100 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-900/50 hover:border-gray-300 dark:hover:border-gray-600 transition-colors">
                    <div className="mt-1 min-w-[24px] h-6 flex items-center justify-center rounded bg-white dark:bg-gray-800 text-xs font-bold text-gray-500 border border-gray-200 dark:border-gray-700 shadow-sm">
                      D
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                        Conclua a Inscrição
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Clique em <strong>"Confirmar Inscrição"</strong> para
                        finalizar o processo.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col h-fit mt-4 lg:mt-0">
                  <div className="mx-auto w-full max-w-xs sm:max-w-md lg:max-w-none rounded-t-lg bg-gray-100 dark:bg-gray-800 border-x border-t border-gray-200 dark:border-gray-700 p-3 flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400/80"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-400/80"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400/80"></div>
                    <div className="ml-2 px-3 py-1 bg-white dark:bg-gray-900 rounded-md text-[10px] text-gray-400 flex-1 truncate">
                      sistema/eventos/inscricao-individual
                    </div>
                  </div>
                  <div className="mx-auto relative w-full max-w-xs sm:max-w-md lg:max-w-none bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-b-lg overflow-hidden">
                    <Image
                      src="/images/imagem da documentação/inscrição_individual.png"
                      alt="Tela de inscrição individual"
                      width={1176}
                      height={654}
                      className="w-full h-auto object-contain"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Inscrição em Grupo */}
          <div className="bg-white dark:bg-gray-800/50 p-6 sm:p-8 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                Inscrição em Grupo
              </h2>
            </div>

            <div className="space-y-6">
              <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                A inscrição em grupo facilita o cadastro de múltiplas pessoas,
                como famílias ou caravanas. Você pode adicionar vários membros
                em uma única inscrição. Para mais detalhes siga para a seção{" "}
                <Link
                  href="/documentation/inscription/in-group"
                  className="text-blue-600 dark:text-blue-400 font-semibold underline"
                >
                  Inscrição em Grupo
                </Link>
                .
              </p>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mt-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-900/30 border border-gray-100 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-900/50 hover:border-gray-300 dark:hover:border-gray-600 transition-colors">
                    <div className="mt-1 min-w-[24px] h-6 flex items-center justify-center rounded bg-white dark:bg-gray-800 text-xs font-bold text-gray-500 border border-gray-200 dark:border-gray-700 shadow-sm">
                      A
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                        Inicie Inscrição em Grupo
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        No card do evento, selecione a opção{" "}
                        <strong>"Inscrição em Grupo"</strong>.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-900/30 border border-gray-100 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-900/50 hover:border-gray-300 dark:hover:border-gray-600 transition-colors">
                    <div className="mt-1 min-w-[24px] h-6 flex items-center justify-center rounded bg-white dark:bg-gray-800 text-xs font-bold text-gray-500 border border-gray-200 dark:border-gray-700 shadow-sm">
                      B
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                        Adicione Membros
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Utilize a busca para encontrar e adicionar cada membro
                        que fará parte do grupo.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-900/30 border border-gray-100 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-900/50 hover:border-gray-300 dark:hover:border-gray-600 transition-colors">
                    <div className="mt-1 min-w-[24px] h-6 flex items-center justify-center rounded bg-white dark:bg-gray-800 text-xs font-bold text-gray-500 border border-gray-200 dark:border-gray-700 shadow-sm">
                      C
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                        Defina o Responsável
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Indique quem será o responsável financeiro e de contato
                        pelo grupo.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-900/30 border border-gray-100 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-900/50 hover:border-gray-300 dark:hover:border-gray-600 transition-colors">
                    <div className="mt-1 min-w-[24px] h-6 flex items-center justify-center rounded bg-white dark:bg-gray-800 text-xs font-bold text-gray-500 border border-gray-200 dark:border-gray-700 shadow-sm">
                      D
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                        Finalize o Grupo
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Clique em <strong>"Salvar Grupo"</strong> para confirmar
                        a inscrição de todos os membros.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col h-fit mt-4 lg:mt-0">
                  <div className="mx-auto w-full max-w-xs sm:max-w-md lg:max-w-none rounded-t-lg bg-gray-100 dark:bg-gray-800 border-x border-t border-gray-200 dark:border-gray-700 p-3 flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400/80"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-400/80"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400/80"></div>
                    <div className="ml-2 px-3 py-1 bg-white dark:bg-gray-900 rounded-md text-[10px] text-gray-400 flex-1 truncate">
                      sistema/eventos/inscricao-grupo
                    </div>
                  </div>
                  <div className="mx-auto relative w-full max-w-xs sm:max-w-md lg:max-w-none bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-b-lg overflow-hidden">
                    <Image
                      src="/images/imagem da documentação/inscrição_em_grupo.png"
                      alt="Tela de inscrição em grupo"
                      width={1176}
                      height={654}
                      className="w-full h-auto object-contain"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
              Nova funcionalidade: Membros
            </h2>
            <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300">
              Pensando em tornar o processo de inscrição nos eventos mais
              simples e ágil, o Sistema de Inscrição foi reformulado para
              oferecer uma experiência mais intuitiva e eficiente. Entre as
              novidades, destaca-se a funcionalidade{" "}
              <Link
                href="/documentation/members"
                className="font-semibold text-blue-600 dark:text-blue-400 underline underline-offset-2"
              >
                Membros
              </Link>
              , que permite o cadastro prévio dos dados pessoais dos
              participantes. Dessa forma, ao realizar uma nova inscrição em um
              evento, não é mais necessário preencher novamente as informações
              de cada participante, tornando o processo muito mais rápido e
              prático.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
