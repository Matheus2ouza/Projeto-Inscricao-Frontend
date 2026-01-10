import { Badge } from "@/shared/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";

export function GroupInscriptionInfo() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Como Funciona</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 1. Responsável */}
          <div className="space-y-2">
            <h4 className="font-semibold">
              1. Preencha os Dados do Responsável
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Informe o nome e telefone obrigatoriamente. O e-mail é opcional,
              mas permite receber atualizações sobre a inscrição.
            </p>
          </div>

          {/* 2. Adicionar membros */}
          <div className="space-y-2">
            <h4 className="font-semibold">2. Adicione os Membros</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Clique em <strong>“Adicionar Membro”</strong> para incluir cada
              participante individualmente.
            </p>
            <ul className="text-sm text-gray-600 dark:text-gray-300 list-disc list-inside space-y-1 mt-2">
              <li>Busque o membro pelo nome</li>
              <li>Selecione o tipo de inscrição</li>
              <li>Confirme a adição do membro</li>
            </ul>
          </div>

          {/* 3. Gerenciamento */}
          <div className="space-y-2">
            <h4 className="font-semibold">3. Gerencie a Lista de Membros</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Visualize todos os membros adicionados na tabela. Você pode editar
              ou remover membros a qualquer momento antes do envio final.
            </p>
            <div className="flex flex-wrap gap-2 mt-2">
              <Badge
                variant="outline"
                className="bg-blue-50 text-blue-700 border-blue-200"
              >
                Visualização em Tempo Real
              </Badge>
              <Badge
                variant="outline"
                className="bg-red-50 text-red-700 border-red-200"
              >
                Remoção Instantânea
              </Badge>
            </div>
          </div>

          {/* 4. Validação */}
          <div className="space-y-2">
            <h4 className="font-semibold">4. Validação em Tempo Real</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              O sistema valida automaticamente os dados do responsável e de cada
              membro adicionado, mostrando erros imediatamente para correção.
            </p>
          </div>

          {/* 5. Envio */}
          <div className="space-y-2">
            <h4 className="font-semibold">5. Finalize a Inscrição</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Após adicionar todos os membros e corrigir possíveis erros, clique
              em <strong>“Finalizar Inscrição em Grupo”</strong> para enviar
              todas as inscrições de uma vez.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Vantagens do Novo Sistema</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-semibold">Adição Manual Simplificada</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Agora você adiciona cada membro individualmente, com busca por
              nome e seleção de tipo de inscrição em uma interface intuitiva.
            </p>
            <ul className="text-sm text-gray-600 dark:text-gray-300 list-disc list-inside space-y-1 mt-2">
              <li>Busca rápida de membros cadastrados</li>
              <li>Seleção de tipo de inscrição com valores</li>
              <li>Visualização prévia dos dados</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold">Validação Imediata</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Cada membro é validado instantaneamente, reduzindo erros e
              garantindo que todas as informações estejam corretas antes do
              envio.
            </p>
            <div className="flex flex-wrap gap-2 mt-2">
              <Badge
                variant="outline"
                className="bg-green-50 text-green-700 border-green-200"
              >
                Validação Instantânea
              </Badge>
              <Badge
                variant="outline"
                className="bg-amber-50 text-amber-700 border-amber-200"
              >
                Feedback Imediato
              </Badge>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold">Controle Total</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Você tem controle completo sobre a lista de membros, podendo
              adicionar, visualizar e remover participantes conforme necessário
              antes da confirmação final.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold">Processo Simplificado</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Sem necessidade de planilhas ou arquivos Excel. Todo o processo é
              feito diretamente na plataforma, com interface amigável e passo a
              passo.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Requisitos e Validações</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-semibold">O que é Necessário</h4>
            <ul className="text-sm text-gray-600 dark:text-gray-300 list-disc list-inside space-y-1">
              <li>Responsável: Nome completo e telefone</li>
              <li>Cada membro: Deve estar previamente cadastrado no sistema</li>
              <li>Tipo de inscrição: Selecionado para cada membro</li>
              <li>Mínimo: 1 membro por inscrição em grupo</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold">O que é Validado</h4>
            <ul className="text-sm text-gray-600 dark:text-gray-300 list-disc list-inside space-y-1">
              <li>Dados completos do responsável</li>
              <li>Existência de cada membro no sistema</li>
              <li>Tipo de inscrição válido para o evento</li>
              <li>Não duplicidade de membros na mesma inscrição</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold">Dicas Importantes</h4>
            <ul className="text-sm text-gray-600 dark:text-gray-300 list-disc list-inside space-y-1">
              <li>
                Certifique-se que os membros já estão cadastrados antes de
                iniciar
              </li>
              <li>Adicione membros individualmente para melhor controle</li>
              <li>Revise todos os dados antes do envio final</li>
              <li>O sistema não permitirá envio com erros de validação</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
