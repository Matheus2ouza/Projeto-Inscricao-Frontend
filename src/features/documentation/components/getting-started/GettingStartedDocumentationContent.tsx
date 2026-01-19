import { Calendar, Info, MapPin } from "lucide-react";
import Image from "next/image";

export default function GettingStartedDocumentationContent() {
  return (
    <div className="space-y-8 text-gray-700 dark:text-gray-300 px-4 sm:px-0">
      {/* Introdução Principal */}
      <div className="space-y-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
          Primeiros Passos no Sistema
        </h1>
        <p className="text-base sm:text-lg leading-relaxed text-gray-600 dark:text-gray-400">
          Bem-vindo ao Sistema de Inscrições! Este é o guia rápido para começar
          a utilizar o nosso sistema de inscrições. Abaixo, você encontrará
          instruções para as primeiras ações que você deve tomar ao receber
          acesso ao sistema.
        </p>
      </div>

      {/* Seções Detalhadas */}
      <div className="space-y-8">
        {/* Passo 1: Registrar Membros */}
        <div className="bg-white dark:bg-gray-800/50 p-6 sm:p-8 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              Registro de Membros
            </h2>
          </div>

          <div className="space-y-6">
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
              Ao acessar o sistema, recomendamos que comece registrando os
              membros. Isso é fundamental pois para registrar as inscrições é
              necessário que os membros estejam previamente cadastrados no
              sistema.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mt-6">
              {/* Passo a passo estilizado */}
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-900/30 border border-gray-100 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-900/50 hover:border-gray-300 dark:hover:border-gray-600 transition-colors">
                  <div className="mt-1 min-w-[24px] h-6 flex items-center justify-center rounded bg-white dark:bg-gray-800 text-xs font-bold text-gray-500 border border-gray-200 dark:border-gray-700 shadow-sm">
                    A
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                      Acesse a área de Membros
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      No menu principal lateral, localize e clique na opção{" "}
                      <strong>"Membros"</strong>.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-900/30 border border-gray-100 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-900/50 hover:border-gray-300 dark:hover:border-gray-600 transition-colors">
                  <div className="mt-1 min-w-[24px] h-6 flex items-center justify-center rounded bg-white dark:bg-gray-800 text-xs font-bold text-gray-500 border border-gray-200 dark:border-gray-700 shadow-sm">
                    B
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                      Inicie o Cadastro
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Clique no botão de destaque{" "}
                      <strong>"Criar Membro"</strong> localizado no topo da
                      página.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-900/30 border border-gray-100 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-900/50 hover:border-gray-300 dark:hover:border-gray-600 transition-colors">
                  <div className="mt-1 min-w-[24px] h-6 flex items-center justify-center rounded bg-white dark:bg-gray-800 text-xs font-bold text-gray-500 border border-gray-200 dark:border-gray-700 shadow-sm">
                    C
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                      Preencha os Dados
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Insira corretamente{" "}
                      <strong>Nome, Data de Nascimento e gênero</strong>
                      solicitados no formulário.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-900/30 border border-gray-100 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-900/50 hover:border-gray-300 dark:hover:border-gray-600 transition-colors">
                  <div className="mt-1 min-w-[24px] h-6 flex items-center justify-center rounded bg-white dark:bg-gray-800 text-xs font-bold text-gray-500 border border-gray-200 dark:border-gray-700 shadow-sm">
                    D
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                      Finalize
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Clique em <strong>"Salvar"</strong>. Seu membro estará
                      pronto para ser inscrito em eventos!
                    </p>
                  </div>
                </div>
              </div>

              {/* Área para Imagem - Estilo Browser Window */}
              <div className="flex flex-col h-fit mt-4 lg:mt-0">
                <div className="mx-auto w-full max-w-xs sm:max-w-md lg:max-w-none rounded-t-lg bg-gray-100 dark:bg-gray-800 border-x border-t border-gray-200 dark:border-gray-700 p-3 flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400/80"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-400/80"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400/80"></div>
                  <div className="ml-2 px-3 py-1 bg-white dark:bg-gray-900 rounded-md text-[10px] text-gray-400 flex-1 truncate">
                    sistema/membros/novo
                  </div>
                </div>
                <div className="mx-auto relative w-full max-w-xs sm:max-w-md lg:max-w-none bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-b-lg overflow-hidden">
                  <Image
                    src="/images/imagem da documentação/registro-membro.png"
                    alt="Tela de registro de membros"
                    width={1176}
                    height={654}
                    className="w-full h-auto object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Passo 2: Navegue pelos Eventos */}
        <div className="bg-white dark:bg-gray-800/50 p-6 sm:p-8 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              Navegue pelos Eventos
            </h2>
          </div>

          <div className="space-y-6">
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
              Encontre o evento que estava procurando. Nossa plataforma organiza
              todos os eventos disponíveis de forma clara e intuitiva,
              facilitando sua busca e inscrição.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mt-6">
              {/* Passo a passo estilizado */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Informações Disponíveis
                </h3>
                <div className="flex items-start gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-900/30 border border-gray-100 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-900/50 hover:border-gray-300 dark:hover:border-gray-600 transition-colors">
                  <div className="mt-1 min-w-[24px] h-6 flex items-center justify-center rounded bg-white dark:bg-gray-800 text-xs font-bold text-blue-500 border border-gray-200 dark:border-gray-700 shadow-sm">
                    <Calendar className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                      Data e Horário
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Saiba exatamente quando o evento começa e termina, para se
                      planejar com antecedência.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-900/30 border border-gray-100 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-900/50 hover:border-gray-300 dark:hover:border-gray-600 transition-colors">
                  <div className="mt-1 min-w-[24px] h-6 flex items-center justify-center rounded bg-white dark:bg-gray-800 text-xs font-bold text-red-500 border border-gray-200 dark:border-gray-700 shadow-sm">
                    <MapPin className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                      Localização
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Verifique o endereço completo e visualize o mapa
                      interativo para traçar sua rota.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-900/30 border border-gray-100 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-900/50 hover:border-gray-300 dark:hover:border-gray-600 transition-colors">
                  <div className="mt-1 min-w-[24px] h-6 flex items-center justify-center rounded bg-white dark:bg-gray-800 text-xs font-bold text-green-500 border border-gray-200 dark:border-gray-700 shadow-sm">
                    <Info className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                      Status e Detalhes
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Acompanhe se as inscrições estão Abertas, Encerradas ou se
                      o evento já foi Finalizado.
                    </p>
                  </div>
                </div>
              </div>

              {/* Área para Imagem - Estilo Browser Window */}
              <div className="flex flex-col h-fit mt-4 lg:mt-0">
                <div className="mx-auto w-full max-w-xs sm:max-w-md lg:max-w-none rounded-t-lg bg-gray-100 dark:bg-gray-800 border-x border-t border-gray-200 dark:border-gray-700 p-3 flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400/80"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-400/80"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400/80"></div>
                  <div className="ml-2 px-3 py-1 bg-white dark:bg-gray-900 rounded-md text-[10px] text-gray-400 flex-1 truncate">
                    sistema/eventos
                  </div>
                </div>
                <div className="mx-auto relative w-full max-w-xs sm:max-w-md lg:max-w-none bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-b-lg overflow-hidden">
                  <Image
                    src="/images/imagem da documentação/eventos.png"
                    alt="Tela de listagem de eventos"
                    width={1176}
                    height={654}
                    className="w-full h-auto object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Passo 3: Inscrição Individual */}
        <div className="bg-white dark:bg-gray-800/50 p-6 sm:p-8 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              Inscrição Individual
            </h2>
          </div>

          <div className="space-y-6">
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
              A inscrição individual é destinada a participantes que desejam se
              inscrever em eventos de forma independente. O processo é simples e
              rápido.
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
                      Selecione o membro que participará do evento. Se for você,
                      selecione seu próprio nome.
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

        {/* Passo 4: Inscrição em Grupo */}
        <div className="bg-white dark:bg-gray-800/50 p-6 sm:p-8 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              Inscrição em Grupo
            </h2>
          </div>

          <div className="space-y-6">
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
              A inscrição em grupo facilita o cadastro de múltiplas pessoas,
              como famílias ou caravanas. Você pode adicionar vários membros em
              uma única inscrição.
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
                      Utilize a busca para encontrar e adicionar cada membro que
                      fará parte do grupo.
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
                      Clique em <strong>"Salvar Grupo"</strong> para confirmar a
                      inscrição de todos os membros.
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
      </div>
    </div>
  );
}
