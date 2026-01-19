import Image from "next/image";

export default function RegisterPaymentDocumentationContent() {
  return (
    <div className="space-y-8 text-gray-700 dark:text-gray-300 px-4 sm:px-0">
      <div className="space-y-4">
        <p className="text-base sm:text-lg leading-relaxed indent-4 sm:indent-8 text-gray-600 dark:text-gray-400">
          Nesta seção, você vai entender como funciona o registro de pagamentos
          das inscrições. Aqui explicamos as novidades do sistema e como você
          pode aproveitar a nova flexibilidade para gerenciar seus pagamentos de
          forma eficiente.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
          <span className="mx-1">•</span> Novidade no Vínculo entre Pagamentos e
          Inscrições
        </h2>

        <p className="text-base sm:text-lg leading-relaxed indent-4 sm:indent-8 text-gray-600 dark:text-gray-300">
          Antes, o sistema tinha uma limitação: cada pagamento só podia ser
          vinculado a uma única inscrição. Com a nova atualização, trouxemos
          muito mais liberdade. Agora, um único pagamento pode ser usado para
          quitar várias inscrições ao mesmo tempo, e uma inscrição também pode
          receber múltiplos pagamentos. Isso facilita muito, por exemplo, quando
          você faz um pagamento único para um grupo de pessoas ou precisa
          parcelar o valor da sua inscrição.
        </p>

        <p className="mt-4 text-base sm:text-lg leading-relaxed indent-4 sm:indent-8 text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/30 border-l-4 border-blue-400/80 px-3 py-3 rounded-md">
          Um ponto importante é que o valor do pagamento é distribuído na ordem
          em que você seleciona as inscrições. Se você escolher primeiro a
          inscrição X e depois a Y, o sistema abate o valor primeiro do saldo da
          X e, só depois, do saldo da Y, seguindo essa sequência até consumir
          todo o valor disponível.
        </p>

        <div className="mt-4">
          <div className="mx-auto flex flex-col h-fit w-full max-w-xs sm:max-w-2xl">
            <div className="w-full rounded-t-lg bg-gray-100 dark:bg-gray-800 border-x border-t border-gray-200 dark:border-gray-700 p-3 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-400/80"></div>
              <div className="w-3 h-3 rounded-full bg-amber-400/80"></div>
              <div className="w-3 h-3 rounded-full bg-green-400/80"></div>
              <div className="ml-2 px-3 py-1 bg-white dark:bg-gray-900 rounded-md text-[10px] text-gray-400 flex-1 truncate">
                sistema/pagamentos/registro
              </div>
            </div>
            <div className="relative bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-b-lg overflow-hidden">
              <Image
                src="/images/imagem da documentação/payment/register/grafico_pagamento.png"
                alt="Gráfico explicando o vínculo entre pagamentos e inscrições após o update"
                width={1176}
                height={654}
                className="w-full h-auto object-contain"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800/50 p-6 sm:p-8 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-300">
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
            Passo a passo para registrar um pagamento
          </h2>
        </div>

        <div className="space-y-6">
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
            Depois de entender como os pagamentos se relacionam com as
            inscrições, você pode registrar um novo pagamento diretamente pelo
            sistema. O fluxo é bem simples e foi pensado para que você saiba
            exatamente o que está fazendo em cada etapa.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mt-6">
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-900/30 border border-gray-100 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-900/50 hover:border-gray-300 dark:hover:border-gray-600 transition-colors">
                <div className="mt-1 min-w-[24px] h-6 flex items-center justify-center rounded bg-white dark:bg-gray-800 text-xs font-bold text-gray-500 border border-gray-200 dark:border-gray-700 shadow-sm">
                  A
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                    Escolha as inscrições a serem pagas
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Acesse o menu de pagamentos, você verá a lista de inscrições
                    pendentes referentes ao evento selecionado.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-900/30 border border-gray-100 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-900/50 hover:border-gray-300 dark:hover:border-gray-600 transition-colors">
                <div className="mt-1 min-w-[24px] h-6 flex items-center justify-center rounded bg-white dark:bg-gray-800 text-xs font-bold text-gray-500 border border-gray-200 dark:border-gray-700 shadow-sm">
                  B
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                    Selecione as inscrições que o pagamento vai cobrir
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Marque uma ou mais inscrições na listagem para indicar
                    exatamente a quais delas o pagamento será vinculado. A ordem
                    em que as inscrições forem selecionadas será respeitada no
                    abatimento do saldo devedor de cada inscrição.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-900/30 border border-gray-100 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-900/50 hover:border-gray-300 dark:hover:border-gray-600 transition-colors">
                <div className="mt-1 min-w-[24px] h-6 flex items-center justify-center rounded bg-white dark:bg-gray-800 text-xs font-bold text-gray-500 border border-gray-200 dark:border-gray-700 shadow-sm">
                  C
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                    Informe o valor e anexe o comprovante
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Preencha o valor que foi pago e faça o upload do comprovante
                    gerado pelo seu banco, lembrando que só se pode anexar um
                    comprovante por pagamento.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-900/30 border border-gray-100 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-900/50 hover:border-gray-300 dark:hover:border-gray-600 transition-colors">
                <div className="mt-1 min-w-[24px] h-6 flex items-center justify-center rounded bg-white dark:bg-gray-800 text-xs font-bold text-gray-500 border border-gray-200 dark:border-gray-700 shadow-sm">
                  D
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                    Confirme o registro e acompanhe a análise
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Depois de revisar os dados, confirme o registro do
                    pagamento. Ele ficará com status em análise até ser
                    processado, caso tenha informado na inscrição algum email
                    então assim que o pagamento for analisado, um email
                    informando que o status do pagamento mudou.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-900/30 border border-gray-100 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-900/50 hover:border-gray-300 dark:hover:border-gray-600 transition-colors">
                <div className="mt-1 min-w-[24px] h-6 flex items-center justify-center rounded bg-white dark:bg-gray-800 text-xs font-bold text-gray-500 border border-gray-200 dark:border-gray-700 shadow-sm">
                  E
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                    Acompanhe a análise
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Caso tenha informado na inscrição algum email então assim
                    que o pagamento for analisado pela organização, um email
                    informando que o status do pagamento mudou será enviado.
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
                    sistema/pagamentos/registro
                  </div>
                </div>
                <div className="mx-auto relative w-full max-w-xs sm:max-w-md lg:max-w-none bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-b-lg overflow-hidden">
                  <Image
                    src="/images/imagem da documentação/payment/register/register_payment.png"
                    alt="Tela de registro de pagamento com seleção de inscrições e dados do pagamento"
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
                    sistema/pagamentos/registro/detalhes
                  </div>
                </div>
                <div className="mx-auto relative w-full max-w-xs sm:max-w-md lg:max-w-none bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-b-lg overflow-hidden">
                  <Image
                    src="/images/imagem da documentação/payment/register/register_payment_2.png"
                    alt="Tela complementar do registro de pagamento com mais detalhes do lançamento"
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

      <div className="space-y-4">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
          <span className="mx-1">•</span> Como funciona a análise e confirmação
          do pagamento
        </h2>
        <p className="text-base sm:text-lg leading-relaxed indent-4 sm:indent-8 text-gray-600 dark:text-gray-300">
          Mesmo quando o valor informado seria suficiente para quitar totalmente
          o saldo das inscrições selecionadas, o pagamento não deixa tudo como
          pago imediatamente. Assim que você registra o lançamento, ele fica com
          status em análise. Só depois que o pagamento é conferido e aprovado é
          que o sistema abate o valor das inscrições, atualiza o saldo devedor e
          marca as inscrições como pagas, quando o valor for suficiente para
          isso.
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800/50 p-6 sm:p-8 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-300">
        <div className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
            Perguntas Frequentes sobre Registro de Pagamentos
          </h2>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
            Abaixo você encontra respostas para dúvidas comuns sobre o processo
            de registro de pagamentos.
          </p>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-900/40 border border-gray-100 dark:border-gray-800">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Posso vincular um único comprovante a várias inscrições?
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Sim! Com a nova atualização, você pode selecionar múltiplas
                inscrições e vincular um único comprovante de pagamento a todas
                elas de uma vez.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-900/40 border border-gray-100 dark:border-gray-800">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                É possível pagar apenas uma parte do valor da inscrição?
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Sim. Como uma inscrição pode receber vários pagamentos, você
                pode registrar pagamentos parciais até atingir o valor total da
                inscrição.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-900/40 border border-gray-100 dark:border-gray-800">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                O que faço se meu pagamento for rejeitado?
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Caso seu pagamento seja rejeitado na análise, junto com os dados
                do pagamento você verá uma mensagem explicando o motivo da
                rejeição.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-900/40 border border-gray-100 dark:border-gray-800">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Em quanto tempo o meu pagamento será analisado?
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                O prazo de análise pode variar conforme a organização do evento
                mas em geral, é de até 24 horas seu pagamento será analisada.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
