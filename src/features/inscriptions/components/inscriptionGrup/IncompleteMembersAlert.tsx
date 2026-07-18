'use client';

import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import { Modal } from 'antd';
import { AlertCircle, User, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

const fieldLabels: Record<string, string> = {
  cpf: 'CPF',
  preferredName: 'Nome social',
  shirtSize: 'Tamanho da camisa',
  shirtType: 'Tipo da camisa',
};

export type IncompleteMember = {
  accountParticipantId: string;
  missingFields: string[];
};

// Novo tipo para estado dos membros
export interface MemberFormData {
  accountParticipantId: string;
  typeInscriptionId: string;
}

// Tipo estendido para exibição na lista
export interface MemberDisplayData extends MemberFormData {
  name: string;
  birthDate?: Date;
  gender?: string;
  typeInscriptionName?: string; // Para mostrar o nome do tipo de inscrição
}

type IncompleteMembersAlertProps = {
  open: boolean;
  incompleteMembers: IncompleteMember[];
  members: MemberDisplayData | MemberDisplayData[] | null;
  onClose: () => void;
};

export function IncompleteMembersAlert({
  open,
  incompleteMembers,
  members,
  onClose,
}: IncompleteMembersAlertProps) {
  const router = useRouter();

  const handleGoToMembers = () => {
    router.push('/user/members');
  };

  const handleEditLater = () => {
    onClose();
  };

  // Converte members para array se for um único objeto
  const membersArray = Array.isArray(members)
    ? members
    : members
      ? [members]
      : [];

  return (
    <Modal
      title={null}
      open={open}
      onCancel={onClose}
      footer={null}
      closable={false}
      centered
      width={520}
      className="[&_.ant-modal-body]:!p-0 [&_.ant-modal-content]:!overflow-hidden [&_.ant-modal-content]:!rounded-2xl [&_.ant-modal-content]:!p-0 [&_.ant-modal-mask]:!backdrop-blur-sm"
    >
      <Card className="border-0 shadow-none">
        <CardHeader className="border-riodavida/10 space-y-2 border-b pb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-riodavida/10 rounded-full p-2">
                <AlertCircle className="text-riodavida h-6 w-6" />
              </div>
              <div>
                <CardTitle className="text-riodavida-gray-dark dark:text-riodavida-gray text-xl font-bold">
                  Cadastro incompleto
                </CardTitle>
                <CardDescription className="text-muted-foreground text-sm">
                  {membersArray.length === 1
                    ? 'O membro precisa completar seus dados antes de prosseguir'
                    : 'Alguns membros precisam completar seus dados antes de prosseguir'}
                </CardDescription>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-riodavida-gray-dark hover:bg-riodavida/10 dark:text-riodavida-gray dark:hover:bg-riodavida/10 rounded-lg p-1.5 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </CardHeader>

        <CardContent className="pt-4">
          <div className="mb-4 rounded-lg border border-blue-200/50 bg-blue-50/80 p-3 dark:border-blue-800/30 dark:bg-blue-900/20">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              <span className="font-semibold">Atenção:</span> Os dados
              incompletos devem ser atualizados na página de listagem de
              membros. Clique em <strong>"Ver membros"</strong> para visualizar
              todos os membros e editar as informações necessárias.
            </p>
          </div>

          <div className="space-y-3">
            {incompleteMembers.map((item) => {
              const member = membersArray.find(
                (m) => m.accountParticipantId === item.accountParticipantId,
              );

              return (
                <div
                  key={item.accountParticipantId}
                  className="border-riodavida/20 bg-riodavida/5 hover:bg-riodavida/10 dark:border-riodavida/20 dark:bg-riodavida/10 dark:hover:bg-riodavida/20 rounded-lg border p-4 transition-colors"
                >
                  <div className="mb-2 flex items-center gap-2">
                    <User className="text-riodavida h-4 w-4" />
                    <span className="text-riodavida-gray-dark dark:text-riodavida-gray font-semibold">
                      {member?.name ?? item.accountParticipantId}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {item.missingFields.map((field) => (
                      <Badge
                        key={field}
                        variant="destructive"
                        className="bg-riodavida/10 text-riodavida border-riodavida/30 dark:bg-riodavida/20 dark:text-riodavida dark:border-riodavida/30 border text-xs font-medium"
                      >
                        {fieldLabels[field] ?? field}
                      </Badge>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>

        <CardFooter className="border-riodavida/10 flex flex-col gap-3 border-t pt-4 sm:flex-row sm:justify-end">
          <Button
            variant="outline"
            onClick={handleEditLater}
            className="border-riodavida/30 text-riodavida hover:bg-riodavida/10 hover:text-riodavida-dark w-full sm:w-auto"
          >
            Fazer depois
          </Button>
          <Button
            onClick={handleGoToMembers}
            className="bg-riodavida hover:bg-riodavida-dark flex w-full items-center gap-2 text-white sm:w-auto"
          >
            Ver membros
          </Button>
        </CardFooter>
      </Card>
    </Modal>
  );
}
