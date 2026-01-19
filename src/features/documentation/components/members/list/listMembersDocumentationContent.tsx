import Image from "next/image";

export default function ListMembersDocumentationContent() {
  return (
    <div className="space-y-8 text-gray-700 dark:text-gray-300 px-4 sm:px-0">
      <div className="space-y-4">
        <p className="text-base sm:text-lg leading-relaxed indent-4 sm:indent-8 text-gray-600 dark:text-gray-400">
          Pensando em facilitar o método de inscrição, o Sistema de Inscrição
          criou a funcionalidade de Membros. Com ela, elimina-se a necessidade
          de preencher os dados dos participantes a cada nova inscrição.
          Participantes que já se inscreveram anteriormente passam a ser
          cadastrados como membros, permitindo que, em novas inscrições para
          eventos, seja necessário apenas selecionar o membro já cadastrado, sem
          precisar informar novamente seus dados pessoais.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
          <span className="mx-1">•</span> Visão geral da tela de membros
        </h2>
        <p className="text-base sm:text-lg leading-relaxed indent-4 sm:indent-8 text-gray-600 dark:text-gray-300">
          A tela de listagem de membros reúne todos os participantes já
          cadastrados no sistema. Nela, você visualiza informações essenciais de
          cada membro, como nome, data de nascimento.
        </p>

        <div className="mt-4">
          <div className="mx-auto flex flex-col h-fit w-full max-w-xs sm:max-w-2xl">
            <div className="w-full rounded-t-lg bg-gray-100 dark:bg-gray-800 border-x border-t border-gray-200 dark:border-gray-700 p-3 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-400/80"></div>
              <div className="w-3 h-3 rounded-full bg-amber-400/80"></div>
              <div className="w-3 h-3 rounded-full bg-green-400/80"></div>
              <div className="ml-2 px-3 py-1 bg-white dark:bg-gray-900 rounded-md text-[10px] text-gray-400 flex-1 truncate">
                sistema/membros
              </div>
            </div>
            <div className="relative bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-b-lg overflow-hidden">
              <Image
                src="/images/imagem da documentação/members/list_members.png"
                alt="Tela de listagem de membros com informações básicas de cada participante"
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
          <span className="mx-1">•</span> Ações disponíveis na listagem de
          membros
        </h2>
        <p className="text-base sm:text-lg leading-relaxed indent-4 sm:indent-8 text-gray-600 dark:text-gray-300">
          A funcionalidade de <strong>Membros</strong> ainda esta sendo
          desenvolvidade então a ação de editar e excluir um membro ainda não
          está disponível.
        </p>
      </div>
    </div>
  );
}
