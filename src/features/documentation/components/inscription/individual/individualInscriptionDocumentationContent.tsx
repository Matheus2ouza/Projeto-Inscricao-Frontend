import Image from "next/image";

export default function IndividualInscriptionDocumentationContent() {
  return (
    <div className="space-y-6 text-gray-700 dark:text-gray-300 px-4 sm:px-0">
      <div className="space-y-8">
        <div className="space-y-4">
          <div className="space-y-2">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
              Introdução
            </h2>
            <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300">
              A inscrição individual é utilizada quando um único participante
              será inscrito em um evento. Nesse fluxo, você informa os dados do
              responsável pela inscrição, seleciona um membro previamente
              cadastrado e escolhe o tipo de inscrição desejado. Após a
              inscrição ser realizada, será gerado um saldo devedor que deverá
              ser pago até a data estipulada pelos organizadores do evento.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800/50 p-6 sm:p-8 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                Dados do Responsável
              </h2>
            </div>

            <div className="space-y-6">
              <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
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
                      sistema/eventos/inscricao-individual
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
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                Seleção do Membro e Dados da Inscrição
              </h2>
            </div>

            <div className="space-y-6">
              <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                Após preencher os dados do responsável, você irá selecionar o
                membro que será inscrito no evento e definir o tipo de
                inscrição. Na inscrição individual, apenas um membro pode ser
                escolhido por vez.
              </p>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mt-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-900/30 border border-gray-100 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-900/50 hover:border-gray-300 dark:hover:border-gray-600 transition-colors">
                    <div className="mt-1 min-w-[24px] h-6 flex items-center justify-center rounded bg-white dark:bg-gray-800 text-xs font-bold text-gray-500 border border-gray-200 dark:border-gray-700 shadow-sm">
                      A
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                        Buscar Membro
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
                        Ao selecionar o membro, os demais dados são preenchidos
                        automaticamente e no card de inscrição. Esses campos são
                        somente leitura, pois vêm diretamente do cadastro de
                        membros.
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
                        Finalize a Inscrição
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Após revisar os dados do responsável, do membro e o tipo
                        de inscrição escolhido, clique em{" "}
                        <strong>"Finalizar Inscrição"</strong> para concluir o
                        processo. Lembre-se: a inscrição individual sempre
                        referencia um único membro por vez.
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
                      src="/images/imagem da documentação/inscription/dados_da_inscricao.png"
                      alt="Tela de inscrição individual com seleção de membro"
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
            <div className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                Perguntas Frequentes sobre Inscrição Individual
              </h2>
              <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                Abaixo você encontra respostas para dúvidas comuns sobre o
                funcionamento da inscrição individual.
              </p>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-900/40 border border-gray-100 dark:border-gray-800">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Preciso ter o membro cadastrado antes de fazer a inscrição?
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Sim. A inscrição individual utiliza a lista de membros já
                    cadastrados no sistema. Primeiro o participante é registrado
                    como membro, na área de gerenciamento de membros.
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

              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-900/40 border border-gray-100 dark:border-gray-800">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Como funciona o valor e o pagamento da inscrição individual?
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    O valor cobrado é definido pelo tipo de inscrição escolhido
                    para o membro. Ao finalizar a inscrição, é gerado um saldo
                    devedor, que deverá ser quitado até a data estabelecida pela
                    organização do evento.
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
