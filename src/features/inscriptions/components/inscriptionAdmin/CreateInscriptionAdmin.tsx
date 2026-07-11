'use client';

import { useFormCreateInscriptionAdmin } from '@/features/inscriptions/hooks/inscriptionAdmin/useFormCreateInscriptionAdmin';
import type { CreateInscriptionAdminForm } from '@/features/inscriptions/schema/inscriptionAdmin/createInscriptionAdminSchema';
import type { Member } from '@/features/members/types/membersCombobox/membersComboboxTypes';
import type { TypeInscriptionOption } from '@/features/typeInscription/components/ComboboxTypeInscription';
import { Button } from '@/shared/components/ui/button';
import { Steps } from 'antd';
import { useState } from 'react';
import { FormProvider, useFieldArray, useWatch } from 'react-hook-form';
import { toast } from 'sonner';
import { InscriptionStep } from './InscriptionStep';
import { ParticipantsStep } from './ParticipantsStep';

type ParticipantFormValue = CreateInscriptionAdminForm['participants'][number];
type ParticipantGender = ParticipantFormValue['gender'];

const normalizeGender = (gender?: string): ParticipantGender => {
  if (gender === 'MASCULINO' || gender === 'FEMININO') {
    return gender;
  }

  return undefined;
};

export default function CreateInscriptionAdmin() {
  const [currentStep, setCurrentStep] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isFetchingMembers, setIsFetchingMembers] = useState(false);
  const [typeValues, setTypeValues] = useState<Record<string, number>>({});
  const [participantsStepError, setParticipantsStepError] = useState(false);

  const { form, onSubmit } = useFormCreateInscriptionAdmin();
  const { control, watch, setValue, trigger } = form;

  const isGuest = watch('isGuest');
  const eventId = watch('eventId');
  const accountId = watch('accountId');

  const participants = useWatch({
    control,
    name: 'participants',
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'participants',
  });

  const handleRefreshMembers = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const validateParticipantsStep = async () => {
    // Limpa o erro ao revalidar
    setParticipantsStepError(false);

    if (!participants || participants.length === 0) {
      toast.warning('Nenhum participante adicionado', {
        description: 'Adicione pelo menos um participante para continuar.',
      });
      setParticipantsStepError(true);
      return false;
    }

    // Valida se todos os participantes têm tipo de inscrição
    const invalidParticipants = participants.filter(
      (p) => !p.typeInscriptionId || p.typeInscriptionId.trim() === '',
    );

    if (invalidParticipants.length > 0) {
      toast.warning('Tipo de inscrição obrigatório', {
        description:
          'Todos os participantes precisam ter um tipo de inscrição selecionado.',
      });
      setParticipantsStepError(true);
      return false;
    }

    return true;
  };

  const handleSubmit = async (event?: React.BaseSyntheticEvent) => {
    event?.preventDefault();

    // Valida os participantes antes de submeter
    const isParticipantsValid = await validateParticipantsStep();
    if (!isParticipantsValid) return;

    const result = await onSubmit(event);
    if (result.success) {
      toast.success('Inscrição criada com sucesso!');
      setCurrentStep(0);
      setParticipantsStepError(false);
    } else {
      toast.error(result.error || 'Erro ao criar inscrição');
    }
  };

  const handleMemberSelected = (memberId: string, fullMember?: Member) => {
    if (!memberId || !fullMember) return;

    const alreadyAdded = fields.some(
      (field) => field.accountParticipantId === memberId,
    );

    if (alreadyAdded) {
      toast.warning('Membro já adicionado', {
        description: 'Este membro já está na lista de participantes',
      });
      return;
    }

    append({
      accountParticipantId: memberId,
      typeInscriptionId: '',
      name: fullMember.name ?? '',
      preferredName: fullMember.preferredName ?? '',
      cpf: fullMember.cpf ?? '',
      birthDate: fullMember.birthDate
        ? new Date(fullMember.birthDate).toISOString().split('T')[0]
        : '',
      gender: normalizeGender(fullMember.gender),
      shirtSize: fullMember.shirtSize,
      shirtType: fullMember.shirtType,
    });

    toast.success('Membro adicionado!', {
      description: 'Selecione o tipo de inscrição para este participante',
    });
  };

  const handleAddManualParticipant = () => {
    if (!isGuest && !eventId) {
      toast.warning('Selecione um evento primeiro', {
        description: 'Escolha o evento antes de adicionar um participante',
      });
      return;
    }

    if (!isGuest && !accountId) {
      toast.warning('Selecione uma conta primeiro', {
        description: 'Escolha a conta antes de adicionar um participante',
      });
      return;
    }

    append({
      typeInscriptionId: '',
      name: '',
      preferredName: '',
      cpf: '',
      birthDate: '',
      gender: undefined,
      shirtSize: undefined,
      shirtType: undefined,
    });
  };

  const handleTypeChange = (
    index: number,
    typeId: string,
    typeOption?: TypeInscriptionOption,
  ) => {
    // Limpa o erro do step quando um tipo é selecionado
    if (typeId) {
      setParticipantsStepError(false);
    }

    if (typeOption) {
      setTypeValues((prev) => ({
        ...prev,
        [typeId]: typeOption.price,
      }));
      return;
    }

    const participant = fields[index] as ParticipantFormValue | undefined;
    if (!typeId && participant?.typeInscriptionId) {
      handleRemoveTypeValue(participant.typeInscriptionId);
    }
  };

  const handleRemoveTypeValue = (typeId: string) => {
    setTypeValues((prev) => {
      const next = { ...prev };
      delete next[typeId];
      return next;
    });
  };

  const getStepStatus = (
    step: number,
  ): 'wait' | 'process' | 'finish' | 'error' => {
    if (step === 1 && participantsStepError) return 'error';
    if (step < currentStep) return 'finish';
    if (step === currentStep) return 'process';
    return 'wait';
  };

  const steps = [
    {
      title: 'Inscrição',
      status: getStepStatus(0),
    },
    {
      title: 'Participantes',
      status: getStepStatus(1),
    },
  ];

  const validateInscriptionStep = async () => {
    const isValid = await trigger(['eventId', 'responsible'], {
      shouldFocus: true,
    });

    if (!isValid) {
      toast.warning('Preencha os dados obrigatórios', {
        description: 'Selecione um evento e informe o responsável.',
      });
    }

    return isValid;
  };

  const handleStepChange = async (nextStep: number) => {
    if (currentStep === 0 && nextStep > 0) {
      const canContinue = await validateInscriptionStep();
      if (!canContinue) return;
    }

    setCurrentStep(nextStep);
  };

  const handleNextStep = async (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (currentStep === 0) {
      const canContinue = await validateInscriptionStep();
      if (!canContinue) return;
    }

    setCurrentStep((step) => Math.min(step + 1, steps.length - 1));
  };

  const renderStepContent = () => {
    if (currentStep === 0) {
      return <InscriptionStep form={form} isGuest={isGuest} />;
    }

    if (currentStep === 1) {
      return (
        <ParticipantsStep
          form={form}
          fields={fields}
          remove={remove}
          isGuest={isGuest}
          eventId={eventId}
          accountId={accountId}
          refreshKey={refreshKey}
          isFetchingMembers={isFetchingMembers}
          onRefreshMembers={handleRefreshMembers}
          onFetchingMembersChange={setIsFetchingMembers}
          onAddManualParticipant={handleAddManualParticipant}
          onMemberSelected={handleMemberSelected}
          onTypeChange={handleTypeChange}
          onRemoveTypeValue={handleRemoveTypeValue}
        />
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="glass-surface overflow-hidden rounded-xl">
        <div className="border-b border-white/10 p-6">
          <Steps
            current={currentStep}
            items={steps}
            onChange={handleStepChange}
            responsive
          />
        </div>

        <FormProvider {...form}>
          <form onSubmit={handleSubmit}>
            <div className="p-6">{renderStepContent()}</div>

            <div className="flex flex-col gap-3 border-t border-white/10 p-6 sm:flex-row sm:items-center sm:justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCurrentStep((step) => Math.max(step - 1, 0))}
                disabled={currentStep === 0}
              >
                Voltar
              </Button>

              <div className="flex flex-col gap-3 sm:flex-row">
                {currentStep === 0 ? (
                  <Button
                    type="button"
                    className="dark:bg-secondary dark:text-secondary-foreground"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleNextStep();
                    }}
                  >
                    Próximo
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    className="dark:bg-secondary dark:text-secondary-foreground"
                  >
                    Criar Inscrição
                  </Button>
                )}
              </div>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
}
