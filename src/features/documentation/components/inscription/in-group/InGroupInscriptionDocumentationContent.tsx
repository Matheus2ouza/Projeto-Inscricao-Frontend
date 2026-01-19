import Image from "next/image";
import Link from "next/link";

export default function InGroupInscriptionDocumentationContent() {
  return (
    <div className="space-y-6 text-gray-700 dark:text-gray-300 px-4 sm:px-0">
      <div className="space-y-8">
        <div className="space-y-4">
          <div className="space-y-2">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
              Introdução
            </h2>
            <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300">
              A inscrição em grupo é utilizada quando múltiplos participantes
              serão inscritos em um mesmo evento. Na primeira etapa, o processo
              é semelhante à inscrição individual, onde você informa os dados do
              responsável pela inscrição. Na segunda etapa, ocorre a principal
              diferença: é possível selecionar vários membros, previamente
              cadastrados no sistema, e definir o tipo de inscrição para cada
              participante. Todos os membros selecionados serão adicionados a
              uma lista de participantes — apenas aqueles que constarem nessa
              lista serão considerados na inscrição. Antes de confirmar,
              verifique atentamente se todos os participantes foram adicionados
              corretamente. Para mais detalhes sobre esse processo, consulte a
              seção{" "}
              <Link
                href="/documentation/inscription/in-group#seleção-do-membro-e-dados-da-inscrição"
                className="text-blue-600 dark:text-blue-400 font-semibold underline"
              >
                {" "}
                Seleção do Membro e Dados da Inscrição{" "}
              </Link>{" "}
              . Após a inscrição ser concluída, será gerado um saldo devedor,
              que deverá ser pago até a data estipulada pelos organizadores do
              evento.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800/50 p-6 sm:p-8 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                Dados do Responsável
              </h2>
            </div>

            <div className="space-y-6">
              <p className="text-base sm:text-lg leading-relaxed indent-8 text-gray-600 dark:text-gray-300">
                O responsável é a pessoa que ficará como contato principal da
                inscrição. É com base nesses dados que o sistema fará qualquer
                comunicação sobre o evento ou sobre a inscrição.
              </p>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mt-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-900/30 border border-gray-100 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-900/50 hover:border-gray-300 dark:hover:border-gray-600 transition-colors">
                    <div className="mt-1 min-w-[24px] h-6 flex items-center justify-center rounded bg-white dark:bg-gray-800 text-xs font-bold text-gray-500 border border-gray-200 dark:border-gray-700 shadow-sm">
                      A
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                        Nome do Responsável
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Informe o nome completo de quem ficará responsável pela
                        inscrição. Este campo é obrigatório.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-900/30 border border-gray-100 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-900/50 hover:border-gray-300 dark:hover:border-gray-600 transition-colors">
                    <div className="mt-1 min-w-[24px] h-6 flex items-center justify-center rounded bg-white dark:bg-gray-800 text-xs font-bold text-gray-500 border border-gray-200 dark:border-gray-700 shadow-sm">
                      B
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                        E-mail do Responsável
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Campo opcional, utilizado para envio de confirmações e
                        atualizações da inscrição. Caso informado, utilize um
                        endereço de e-mail válido.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-900/30 border border-gray-100 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-900/50 hover:border-gray-300 dark:hover:border-gray-600 transition-colors">
                    <div className="mt-1 min-w-[24px] h-6 flex items-center justify-center rounded bg-white dark:bg-gray-800 text-xs font-bold text-gray-500 border border-gray-200 dark:border-gray-700 shadow-sm">
                      C
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                        Telefone do Responsável
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Informe um telefone válido para contato, no formato
                        <strong>(DDD) 9XXXX-XXXX</strong>. Este campo é
                        obrigatório,pois é utilizado para contato em caso de
                        necessidade.
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
                      sistema/inscricao/em-grupo
                    </div>
                  </div>
                  <div className="mx-auto relative w-full max-w-xs sm:max-w-md lg:max-w-none bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-b-lg overflow-hidden">
                    <Image
                      src="/images/imagem da documentação/inscription/dados_do_responsavel.png"
                      alt="Tela de inscrição individual com dados do responsável"
                      width={1176}
                      height={654}
                      className="w-full h-auto object-contain"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800/50 p-6 sm:p-8 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center gap-3 mb-6">
              <h2
                id="seleção-do-membro-e-dados-da-inscrição"
                className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white"
              >
                Seleção do Membro e Dados da Inscrição
              </h2>
            </div>

            <div className="space-y-6">
              <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                Após preencher os dados do responsável, você deverá selecionar
                os membros que serão inscritos no evento e definir o tipo de
                inscrição. Na inscrição em grupo, os membros são adicionados um
                por vez, permitindo que você inclua quantos participantes forem
                necessários na mesma inscrição.
              </p>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mt-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-900/30 border border-gray-100 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-900/50 hover:border-gray-300 dark:hover:border-gray-600 transition-colors">
                    <div className="mt-1 min-w-[24px] h-6 flex items-center justify-center rounded bg-white dark:bg-gray-800 text-xs font-bold text-gray-500 border border-gray-200 dark:border-gray-700 shadow-sm">
                      A
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                        Adicionar Membro
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Utilize o campo de busca para localizar um membro já
                        cadastrado no sistema.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-900/30 border border-gray-100 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-900/50 hover:border-gray-300 dark:hover:border-gray-600 transition-colors">
                    <div className="mt-1 min-w-[24px] h-6 flex items-center justify-center rounded bg-white dark:bg-gray-800 text-xs font-bold text-gray-500 border border-gray-200 dark:border-gray-700 shadow-sm">
                      B
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                        Dados do Membro preenchidos automaticamente
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Ao selecionar um membro, os demais dados do participante
                        são preenchidos automaticamente e exibidos no card de
                        inscrição. Esses campos são somente leitura, pois são
                        carregados diretamente a partir do cadastro de membros.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-900/30 border border-gray-100 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-900/50 hover:border-gray-300 dark:hover:border-gray-600 transition-colors">
                    <div className="mt-1 min-w-[24px] h-6 flex items-center justify-center rounded bg-white dark:bg-gray-800 text-xs font-bold text-gray-500 border border-gray-200 dark:border-gray-700 shadow-sm">
                      C
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                        Escolha o Tipo de Inscrição
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Com o membro selecionado, você poderá escolher o tipo de
                        inscrição disponível para o evento.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-900/30 border border-gray-100 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-900/50 hover:border-gray-300 dark:hover:border-gray-600 transition-colors">
                    <div className="mt-1 min-w-[24px] h-6 flex items-center justify-center rounded bg-white dark:bg-gray-800 text-xs font-bold text-gray-500 border border-gray-200 dark:border-gray-700 shadow-sm">
                      D
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                        Membro na Lista
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Na Inscrição em Grupo, a cada participante adicionado
                        juntamente com o tipo de inscrição, ele passa a compor a
                        lista da inscrição em andamento. Nessa lista, é possível
                        acompanhar quantos membros já foram incluídos e
                        visualizar o valor total da inscrição em tempo real.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-900/30 border border-gray-100 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-900/50 hover:border-gray-300 dark:hover:border-gray-600 transition-colors">
                    <div className="mt-1 min-w-[24px] h-6 flex items-center justify-center rounded bg-white dark:bg-gray-800 text-xs font-bold text-gray-500 border border-gray-200 dark:border-gray-700 shadow-sm">
                      D
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                        Finalize a Inscrição
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Após adicionar todos os membros e seus tipos de
                        inscrição, verifique se os dados estão corretos. Se tudo
                        estiver ok, clique em{" "}
                        <strong>Finalizar Inscrição</strong>.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col h-fit mt-4 lg:mt-0 space-y-6">
                  <div>
                    <div className="mx-auto w-full max-w-xs sm:max-w-md lg:max-w-none rounded-t-lg bg-gray-100 dark:bg-gray-800 border-x border-t border-gray-200 dark:border-gray-700 p-3 flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-400/80"></div>
                      <div className="w-3 h-3 rounded-full bg-amber-400/80"></div>
                      <div className="w-3 h-3 rounded-full bg-green-400/80"></div>
                      <div className="ml-2 px-3 py-1 bg-white dark:bg-gray-900 rounded-md text-[10px] text-gray-400 flex-1 truncate">
                        sistema/inscricao/em-grupo
                      </div>
                    </div>
                    <div className="mx-auto relative w-full max-w-xs sm:max-w-md lg:max-w-none bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-b-lg overflow-hidden">
                      <Image
                        src="/images/imagem da documentação/inscription/dados_da_inscricao_em_grupo.png"
                        alt="Tela de inscrição individual com seleção de membro"
                        width={1176}
                        height={654}
                        className="w-full h-auto object-contain"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="mx-auto w-full max-w-xs sm:max-w-md lg:max-w-none rounded-t-lg bg-gray-100 dark:bg-gray-800 border-x border-t border-gray-200 dark:border-gray-700 p-3 flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-400/80"></div>
                      <div className="w-3 h-3 rounded-full bg-amber-400/80"></div>
                      <div className="w-3 h-3 rounded-full bg-green-400/80"></div>
                      <div className="ml-2 px-3 py-1 bg-white dark:bg-gray-900 rounded-md text-[10px] text-gray-400 flex-1 truncate">
                        sistema/inscricao/em-grupo/membros
                      </div>
                    </div>
                    <div className="mx-auto relative w-full max-w-xs sm:max-w-md lg:max-w-none bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-b-lg overflow-hidden">
                      <Image
                        src="/images/imagem da documentação/inscription/dados_da_inscricao_em_grupo_2.png"
                        alt="Tela de inscrição em grupo com múltiplos membros"
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

          <div className="bg-white dark:bg-gray-800/50 p-6 sm:p-8 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                Perguntas Frequentes sobre Inscrição em Grupo
              </h2>
              <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                Abaixo você encontra respostas para as dúvidas mais comuns sobre
                o funcionamento da inscrição em grupo.
              </p>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-900/40 border border-gray-100 dark:border-gray-800">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Quantos membros posso adicionar em uma inscrição em grupo?
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Não há um limite fixo definido pelo sistema. É possível
                    adicionar quantos membros forem necessários para a
                    inscrição.
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-900/40 border border-gray-100 dark:border-gray-800">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Posso remover ou trocar um membro antes de finalizar?
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Sim. Enquanto a inscrição ainda não foi finalizada, você
                    pode remover membros da lista e adicionar outros no lugar.
                    Apenas os participantes que permanecerem na lista no momento
                    da finalização serão considerados na inscrição.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-900/40 border border-gray-100 dark:border-gray-800">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Como o valor total da inscrição em grupo é calculado?
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    O valor total é calculado com base na soma do valor de cada
                    membro de acordo com o tipo de inscrição escolhido.
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-900/40 border border-gray-100 dark:border-gray-800">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Após finalizar a inscrição, ainda é possível fazer
                    alterações?
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Após finalizar a inscrição em grupo, ainda é possível fazer
                    alterações em: <strong>Minhas Inscrições</strong> mas vale
                    ressaltar que as alterações seguem as regras estabelecidas
                    pelo sistema.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
