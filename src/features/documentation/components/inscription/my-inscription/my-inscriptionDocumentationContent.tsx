import { Eye, Trash2 } from "lucide-react";
import Image from "next/image";

export default function MyInscriptionDocumentationContent() {
  return (
    <div className="space-y-8 text-gray-700 dark:text-gray-300 px-4 sm:px-0">
      <div className="space-y-4">
        <p className="text-base sm:text-lg leading-relaxed indent-4 sm:indent-8 text-gray-600 dark:text-gray-400">
          Nesta seção, você pode visualizar e gerenciar todas as inscrições
          realizadas no sistema. É possível acompanhar o status de cada
          inscrição, consultar os detalhes dos participantes, verificar valores
          pendentes e acessar rapidamente ações como visualizar pagamentos ou
          cancelar uma inscrição.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
          <span className="mx-1">•</span> Visão geral da tela
        </h2>
        <p className="text-base sm:text-lg leading-relaxed indent-4 sm:indent-8 text-gray-600 dark:text-gray-300">
          A tela de Minhas Inscrições reúne em um só lugar todas as inscrições
          que você fez em organizadas por evento, facilitando o acompanhamento
          do histórico e da situação atual de cada uma delas.
        </p>

        <div className="mt-4">
          <div className="mx-auto flex flex-col h-fit w-full max-w-xs sm:max-w-2xl">
            <div className="w-full rounded-t-lg bg-gray-100 dark:bg-gray-800 border-x border-t border-gray-200 dark:border-gray-700 p-3 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-400/80"></div>
              <div className="w-3 h-3 rounded-full bg-amber-400/80"></div>
              <div className="w-3 h-3 rounded-full bg-green-400/80"></div>
              <div className="ml-2 px-3 py-1 bg-white dark:bg-gray-900 rounded-md text-[10px] text-gray-400 flex-1 truncate">
                sistema/inscricoes/minhas-inscricoes
              </div>
            </div>
            <div className="relative bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-b-lg overflow-hidden">
              <Image
                src="/images/imagem da documentação/my-inscription/my-inscriptions.png"
                alt="Tela de Minhas Inscrições com lista de inscrições realizadas"
                width={1176}
                height={654}
                className="w-full h-auto object-contain"
              />
            </div>
          </div>
        </div>

        <div className="mt-4 space-y-3">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Informações exibidas na listagem
          </h3>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
            Cada linha da tabela representa uma inscrição que você realizou,
            trazendo dados como o responsável pela inscrição, status, quantidade
            de participantes.
          </p>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
            A partir desta listagem, você pode acessar os detalhes completos de
            cada inscrição, incluindo os participantes, pagamentos registrados e
            ações disponíveis para gerenciamento, clicando no ícone{" "}
            <Eye className="inline h-5 w-5 align-text-bottom text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:bg-blue-900/20" />
            .
          </p>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
            Clicando no ícone{" "}
            <Trash2 className="inline h-5 w-5 align-text-bottom text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-900/20" />{" "}
            você pode deletar a inscrição, desde que nenhum pagamento tenha sido
            realizado. Vale ressaltar que, uma vez deletada, a inscrição não
            poderá ser recuperada, portanto utilize essa opção apenas como
            último recurso.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
          <span className="mx-1">•</span>Detalhes da inscrição
        </h2>
        <p className="text-base sm:text-lg leading-relaxed indent-4 sm:indent-8 text-gray-600 dark:text-gray-300">
          Ao clicar para visualizar os detalhes de uma inscrição, você é
          direcionado para uma tela onde pode consultar informações completas
          sobre o responsável, os participantes vinculados, os pagamentos
          registrados e o histórico de ações relacionadas àquela inscrição em
          específico.
        </p>

        <div className="mt-4">
          <div className="mx-auto flex flex-col h-fit w-full max-w-xs sm:max-w-2xl">
            <div className="w-full rounded-t-lg bg-gray-100 dark:bg-gray-800 border-x border-t border-gray-200 dark:border-gray-700 p-3 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-400/80"></div>
              <div className="w-3 h-3 rounded-full bg-amber-400/80"></div>
              <div className="w-3 h-3 rounded-full bg-green-400/80"></div>
              <div className="ml-2 px-3 py-1 bg-white dark:bg-gray-900 rounded-md text-[10px] text-gray-400 flex-1 truncate">
                sistema/inscricoes/minhas-inscricoes/detalhes
              </div>
            </div>
            <div className="relative bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-b-lg overflow-hidden">
              <Image
                src="/images/imagem da documentação/my-inscription/registration_details.png"
                alt="Tela de detalhes de uma inscrição com informações completas"
                width={1176}
                height={654}
                className="w-full h-auto object-contain"
              />
            </div>
          </div>
        </div>

        <div className="mt-4 space-y-3">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Edição e exclusão da inscrição
          </h3>
          <p className="text-base sm:text-lg leading-relaxed indent-4 sm:indent-8 text-gray-600 dark:text-gray-300">
            Nesta tela de detalhes, a opção de edição permite alterar apenas os
            dados do responsável pela inscrição, como nome, telefone e e-mail,
            garantindo que as informações de contato estejam sempre atualizadas.
            Os dados dos participantes vinculados a essa inscrição não são
            alterados por essa ação; as funcionalidades de edição e exclusão
            diretamente dos participantes ainda não estão disponíveis para o
            usuário e encontram-se em desenvolvimento.
          </p>
          <p className="text-base sm:text-lg leading-relaxed indent-4 sm:indent-8 text-gray-600 dark:text-gray-300">
            A funcionalidade de exclusão da inscrição só fica disponível quando
            ainda não existe nenhum pagamento registrado para aquela inscrição.
            Uma vez que a exclusão é confirmada, a ação não pode ser revertida e
            os dados deixam de ficar acessíveis no sistema, por isso utilize
            essa opção com cautela e apenas quando tiver certeza de que a
            inscrição não será mais necessária.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
          <span className="mx-1">•</span>Resumo financeiro da inscrição
        </h2>
        <p className="text-base sm:text-lg leading-relaxed indent-4 sm:indent-8 text-gray-600 dark:text-gray-300">
          Na parte de resumo financeiro, você visualiza de forma consolidada os
          valores relacionados à inscrição, como total a pagar, valor já pago e
          o saldo ainda pendente, facilitando o acompanhamento financeiro de
          cada inscrição.
        </p>

        <div className="mt-4">
          <div className="mx-auto flex flex-col h-fit w-full max-w-xs sm:max-w-2xl">
            <div className="w-full rounded-t-lg bg-gray-100 dark:bg-gray-800 border-x border-t border-gray-200 dark:border-gray-700 p-3 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-400/80"></div>
              <div className="w-3 h-3 rounded-full bg-amber-400/80"></div>
              <div className="w-3 h-3 rounded-full bg-green-400/80"></div>
              <div className="ml-2 px-3 py-1 bg-white dark:bg-gray-900 rounded-md text-[10px] text-gray-400 flex-1 truncate">
                sistema/inscricoes/minhas-inscricoes/detalhes/resumo-financeiro
              </div>
            </div>
            <div className="relative bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-b-lg overflow-hidden">
              <Image
                src="/images/imagem da documentação/my-inscription/financial_summary.png"
                alt="Resumo financeiro da inscrição com valores pagos e pendentes"
                width={1176}
                height={654}
                className="w-full h-auto object-contain"
              />
            </div>
          </div>
        </div>

        <div className="mt-4 space-y-3">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Detalhamento do resumo financeiro
          </h3>
          <p className="text-base sm:text-lg leading-relaxed indent-4 sm:indent-8 text-gray-600 dark:text-gray-300">
            No resumo financeiro, cada indicador apresenta uma visão clara da
            situação da inscrição: o valor total representa tudo o que deve ser
            pago, o valor já pago mostra o que foi efetivamente registrado como
            pagamento no sistema e o saldo pendente indica quanto ainda falta
            para a regularização completa daquela inscrição.
          </p>
          <p className="text-base sm:text-lg leading-relaxed indent-4 sm:indent-8 text-gray-600 dark:text-gray-300">
            À medida que novos pagamentos são lançados ou atualizados, esses
            valores são recalculados, permitindo acompanhar com precisão o
            progresso financeiro. Quando o saldo pendente chega a zero, a
            inscrição é considerada totalmente quitada.
          </p>
          <p className="text-base sm:text-lg leading-relaxed indent-4 sm:indent-8 text-gray-600 dark:text-gray-300">
            Você encontrará também dois botões um para registrar um novo
            pagamento e outro para visualizar todos os pagamentos realizados na
            inscrição.
          </p>
        </div>
      </div>
    </div>
  );
}
