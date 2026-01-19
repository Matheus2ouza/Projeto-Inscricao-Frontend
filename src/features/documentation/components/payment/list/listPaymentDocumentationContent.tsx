import Image from "next/image";

export default function ListPaymentDocumentationContent() {
  return (
    <div className="space-y-8 text-gray-700 dark:text-gray-300 px-4 sm:px-0">
      <div className="space-y-4">
        <p className="text-base sm:text-lg leading-relaxed indent-4 sm:indent-8 text-gray-600 dark:text-gray-400">
          Na lista de pagamentos você acompanha tudo o que já foi registrado no
          sistema. Aqui você consegue ver rapidamente quem pagou, quanto foi
          pago, quais inscrições foram cobertas e o status de cada pagamento.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
          <span className="mx-1">•</span> Visão geral da tela de pagamentos
        </h2>
        <p className="text-base sm:text-lg leading-relaxed indent-4 sm:indent-8 text-gray-600 dark:text-gray-300">
          A tela de listagem exibe todos os pagamentos já registrados no
          sistema, apresentando informações como valor, forma de pagamento,
          data, responsável e as inscrições vinculadas. Nessa tela, você pode
          conferir se um pagamento foi lançado corretamente, acompanhar o status
          de cada registro, acessar os detalhes completos de um pagamento
          específico e, quando permitido, realizar a exclusão do pagamento.
        </p>

        <div className="mt-4">
          <div className="mx-auto flex flex-col h-fit w-full max-w-xs sm:max-w-2xl">
            <div className="w-full rounded-t-lg bg-gray-100 dark:bg-gray-800 border-x border-t border-gray-200 dark:border-gray-700 p-3 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-400/80"></div>
              <div className="w-3 h-3 rounded-full bg-amber-400/80"></div>
              <div className="w-3 h-3 rounded-full bg-green-400/80"></div>
              <div className="ml-2 px-3 py-1 bg-white dark:bg-gray-900 rounded-md text-[10px] text-gray-400 flex-1 truncate">
                sistema/pagamentos/lista
              </div>
            </div>
            <div className="relative bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-b-lg overflow-hidden">
              <Image
                src="/images/imagem da documentação/payment/list/list_payments.png"
                alt="Tela de listagem de pagamentos com informações detalhadas de cada registro"
                width={1176}
                height={654}
                className="w-full h-auto object-contain"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
          <span className="mx-1">•</span> Detalhes do pagamento
        </h2>
        <p className="text-base sm:text-lg leading-relaxed indent-4 sm:indent-8 text-gray-600 dark:text-gray-300">
          Ao acessar os detalhes de um pagamento, você visualiza informações
          completas sobre o lançamento, como o valor total pago, a forma de
          pagamento utilizada, a data em que o pagamento foi registrado, quem é
          o responsável pelo pagamento e todas as inscrições que foram cobertas
          por aquele registro. Essa tela é ideal para conferir se tudo foi
          lançado corretamente e entender exatamente como o pagamento foi
          distribuído entre as inscrições.
        </p>

        <div className="mt-4">
          <div className="mx-auto flex flex-col h-fit w-full max-w-xs sm:max-w-2xl">
            <div className="w-full rounded-t-lg bg-gray-100 dark:bg-gray-800 border-x border-t border-gray-200 dark:border-gray-700 p-3 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-400/80"></div>
              <div className="w-3 h-3 rounded-full bg-amber-400/80"></div>
              <div className="w-3 h-3 rounded-full bg-green-400/80"></div>
              <div className="ml-2 px-3 py-1 bg-white dark:bg-gray-900 rounded-md text-[10px] text-gray-400 flex-1 truncate">
                sistema/pagamentos/lista/detalhes
              </div>
            </div>
            <div className="relative bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-b-lg overflow-hidden">
              <Image
                src="/images/imagem da documentação/payment/list/detail_payment.png"
                alt="Tela de detalhes do pagamento com informações completas do lançamento"
                width={1176}
                height={654}
                className="w-full h-auto object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
