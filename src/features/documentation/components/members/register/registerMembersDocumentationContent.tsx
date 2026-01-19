import Image from "next/image";

export default function RegisterMembersDocumentationContent() {
  return (
    <div className="space-y-8 text-gray-700 dark:text-gray-300 px-4 sm:px-0">
      <div className="space-y-4">
        <p className="text-base sm:text-lg leading-relaxed indent-4 sm:indent-8 text-gray-600 dark:text-gray-400">
          Se você já realizou inscrições em eventos anteriores, os participantes
          cadastrados nesses eventos foram automaticamente convertidos em
          membros. Dessa forma, ao acessar a funcionalidade de Membros, você
          verá que esses participantes já estarão listados, prontos para serem
          utilizados em novas inscrições.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
          <span className="mx-1">•</span> Visão geral do registro de membros
        </h2>
        <p className="text-base sm:text-lg leading-relaxed indent-4 sm:indent-8 text-gray-600 dark:text-gray-300">
          Para registrar um novo membro, acesse a área de{" "}
          <strong>Membros</strong> e clique no botão{" "}
          <strong>"Criar Membro"</strong>. Na tela de registro, os dados
          solicitados são: <strong>Nome completo</strong>,{" "}
          <strong>Data de nascimento</strong> e <strong>Gênero</strong>. No
          campo de nome, é importante informar pelo menos um nome e um
          sobrenome, para facilitar a identificação correta do participante nas
          listagens e relatórios. Após preencher esses campos obrigatórios,
          basta salvar para que o participante passe a aparecer na listagem de
          membros e possa ser utilizado nos fluxos de inscrição. Veja o exemplo
          abaixo:
        </p>

        <div className="mt-4">
          <div className="mx-auto flex flex-col h-fit w-full max-w-xs sm:max-w-2xl">
            <div className="w-full rounded-t-lg bg-gray-100 dark:bg-gray-800 border-x border-t border-gray-200 dark:border-gray-700 p-3 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-400/80"></div>
              <div className="w-3 h-3 rounded-full bg-amber-400/80"></div>
              <div className="w-3 h-3 rounded-full bg-green-400/80"></div>
              <div className="ml-2 px-3 py-1 bg-white dark:bg-gray-900 rounded-md text-[10px] text-gray-400 flex-1 truncate">
                sistema/membros/novo
              </div>
            </div>
            <div className="relative bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-b-lg overflow-hidden">
              <Image
                src="/images/imagem da documentação/members/add_inscription.png"
                alt="Tela de registro de membro com formulário de cadastro do participante"
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
