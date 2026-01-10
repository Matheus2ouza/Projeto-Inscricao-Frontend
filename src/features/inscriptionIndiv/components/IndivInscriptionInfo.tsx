import { Badge } from "@/shared/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";

export function IndividualInscriptionInfo() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Como Funciona</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-semibold">1. Selecione um Membro</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Use o campo de busca para encontrar e selecionar um membro já
              cadastrado no sistema.
            </p>
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-3 mt-2">
              <p className="text-xs text-blue-800 dark:text-blue-300">
                <strong>Dica:</strong> Ao selecionar um membro, todos os dados
                pessoais (nome, data de nascimento e gênero) são preenchidos
                automaticamente.
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold">2. Dados do Responsável</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Preencha seus dados como responsável pela inscrição. Esses dados
              são obrigatórios para contato.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold">3. Tipo de Inscrição</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Selecione o tipo de inscrição desejada para o membro escolhido.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold">4. Confirme e Envie</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Revise todos os dados e finalize a inscrição.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Informações Importantes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-semibold">Sistema Automático</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              O formulário funciona de forma inteligente:
            </p>
            <ul className="text-sm text-gray-600 dark:text-gray-300 list-disc list-inside space-y-1 mt-2">
              <li>
                <strong>Busque membros:</strong> Digite o nome para encontrar
                membros cadastrados
              </li>
              <li>
                <strong>Preenchimento automático:</strong> Ao selecionar, os
                dados pessoais são preenchidos
              </li>
              <li>
                <strong>Inscrição segura:</strong> O sistema verifica se o
                membro já está inscrito no evento
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold">Dados Obrigatórios</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Para realizar a inscrição, você precisa fornecer:
            </p>
            <div className="flex flex-wrap gap-2 mt-2">
              <Badge
                variant="outline"
                className="bg-blue-50 text-blue-700 border-blue-200"
              >
                Nome do Responsável
              </Badge>
              <Badge
                variant="outline"
                className="bg-blue-50 text-blue-700 border-blue-200"
              >
                Telefone para Contato
              </Badge>
              <Badge
                variant="outline"
                className="bg-green-50 text-green-700 border-green-200"
              >
                Membro Selecionado
              </Badge>
              <Badge
                variant="outline"
                className="bg-green-50 text-green-700 border-green-200"
              >
                Tipo de Inscrição
              </Badge>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
              O e-mail do responsável é opcional e será usado apenas para
              atualizações sobre a inscrição.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold">Benefícios do Sistema</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Ao usar membros cadastrados:
            </p>
            <ul className="text-sm text-gray-600 dark:text-gray-300 list-disc list-inside space-y-1 mt-2">
              <li>Evita duplicação de cadastros</li>
              <li>Mantém histórico completo do membro</li>
              <li>Garante consistência dos dados</li>
              <li>Economiza tempo no preenchimento</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Suporte e Ajuda</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <h4 className="font-semibold">Não encontrou o membro?</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Se o membro que deseja inscrever não está cadastrado no sistema,
              você precisa:
            </p>
            <ol className="text-sm text-gray-600 dark:text-gray-300 list-decimal list-inside space-y-1 mt-2">
              <li>Acessar a seção "Membros" no menu</li>
              <li>Criar um novo cadastro do membro</li>
              <li>Retornar a esta página para realizar a inscrição</li>
            </ol>
          </div>

          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-lg p-3">
            <p className="text-xs text-amber-800 dark:text-amber-300">
              <strong>Importante:</strong> A seleção do membro é obrigatória
              para continuar. Verifique se todos os dados do responsável estão
              corretos antes de finalizar a inscrição.
            </p>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-3">
            <p className="text-xs text-blue-800 dark:text-blue-300">
              <strong>Dúvidas?</strong> Entre em contato com nossa equipe de
              suporte se encontrar problemas durante o processo de inscrição.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
