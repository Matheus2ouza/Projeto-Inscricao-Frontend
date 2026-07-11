'use client';

import { useGlobalLoading } from '@/components/GlobalLoading';
import { registerIndividualInscriptionAction } from '@/features/inscriptions/actions/individualInscription/registerIndividualInscriptionAction';
import { MemberSingleOption } from '@/features/members/components/membersCombobox/ComboboxMemberSingle';
import { useInvalidateMembersQuery } from '@/features/members/hook/useMembersQuery';
import { zodResolver } from '@hookform/resolvers/zod';
import * as React from 'react';
import { SubmitHandler, useForm, UseFormRegister } from 'react-hook-form';
import { toast } from 'sonner';
import {
  IndividualInscriptionFormInputs,
  individualInscriptionSchema,
} from '../../schema/inscriptionIndiv/individualInscriptionSchema';
import {
  FormErrors,
  IndividualInscriptionSubmit,
  UseFormIndividualInscriptionProps,
  UseFormIndividualInscriptionReturn,
} from '../../types/individualInscription/individualInscriptionTypes';

export function useFormCreateIndividualInscription({
  eventId,
}: UseFormIndividualInscriptionProps): UseFormIndividualInscriptionReturn {
  const { setLoading } = useGlobalLoading();

  // Estado para o ID do membro selecionado
  const [selectedMemberId, setSelectedMemberId] = React.useState<string>('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Hook para invalidar cache de membros
  const { invalidateLists } = useInvalidateMembersQuery();

  // Inicializar o react-hook-form com Zod
  const {
    register,
    handleSubmit: rhfHandleSubmit,
    formState: { errors },
    setValue,
    watch,
    trigger,
    reset,
  } = useForm<IndividualInscriptionFormInputs>({
    resolver: zodResolver(individualInscriptionSchema),
    defaultValues: {
      responsible: '',
      email: '',
      phone: '',
      participantName: '',
      birthDate: '',
      gender: '',
      typeInscriptionId: '',
    },
    mode: 'onChange',
  });

  // Observar os valores do formulário
  const formData = watch();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === 'phone') {
      const formattedPhone = formatPhone(value);
      setValue(name as keyof IndividualInscriptionFormInputs, formattedPhone);
    } else if (name === 'birthDate') {
      const formattedDate = formatDate(value);
      setValue(name as keyof IndividualInscriptionFormInputs, formattedDate);
    } else {
      setValue(name as keyof IndividualInscriptionFormInputs, value);
    }

    trigger(name as keyof IndividualInscriptionFormInputs);
  };

  const handleMemberSelect = (
    memberId: string,
    member?: MemberSingleOption,
  ) => {
    setSelectedMemberId(memberId);

    if (member) {
      setValue('participantName', member.label);

      if (member.member?.birthDate) {
        const birthDate = new Date(member.member?.birthDate);
        const formattedDate = birthDate.toLocaleDateString('pt-BR');
        setValue('birthDate', formattedDate);
      }

      if (member.member?.gender) {
        setValue('gender', member.member?.gender.toLowerCase());
      }

      trigger('participantName');
      trigger('birthDate');
      trigger('gender');
    }
  };

  const clearForm = React.useCallback(() => {
    reset({
      responsible: '',
      email: '',
      phone: '',
      participantName: '',
      birthDate: '',
      gender: '',
      typeInscriptionId: '',
    });
    setSelectedMemberId('');
  }, [reset]);

  const formatPhone = (value: string): string => {
    const numbers = value.replace(/\D/g, '');

    if (numbers.length <= 2) {
      return numbers ? `(${numbers}` : '';
    } else if (numbers.length <= 6) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    } else if (numbers.length <= 10) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(
        7,
      )}`;
    } else {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(
        7,
        11,
      )}`;
    }
  };

  const formatDate = (value: string): string => {
    const numbers = value.replace(/\D/g, '');

    if (numbers.length <= 2) {
      return numbers;
    } else if (numbers.length <= 4) {
      return `${numbers.slice(0, 2)}/${numbers.slice(2)}`;
    } else {
      return `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}/${numbers.slice(
        4,
        8,
      )}`;
    }
  };

  const onSubmit: SubmitHandler<IndividualInscriptionFormInputs> = async (
    data,
  ) => {
    const apiData: IndividualInscriptionSubmit = {
      responsible: data.responsible,
      phone: data.phone,
      eventId,
      member: {
        accountParticipantId: selectedMemberId,
        typeInscriptionId: data.typeInscriptionId,
      },
    };

    if (data.email) {
      apiData.email = data.email;
    }

    setLoading(true);
    setIsSubmitting(true);

    try {
      // Chamar o action diretamente
      const response = await registerIndividualInscriptionAction(apiData);

      toast.success('Inscrição realizada com sucesso!', {
        description: `ID: ${response.id}`,
      });

      clearForm();
      invalidateLists();
    } catch (error: unknown) {
      console.error('Erro:', error);

      // O erro já vem tratado do service com mensagem amigável
      const errorMessage =
        error instanceof Error ? error.message : 'Erro ao processar inscrição';

      toast.error(errorMessage);
    } finally {
      setLoading(false);
      setIsSubmitting(false);
    }
  };

  const handleFormSubmit = rhfHandleSubmit(onSubmit);

  return {
    formData,
    isSubmitting,
    formErrors: errors as FormErrors,
    selectedMemberId,
    handleInputChange,
    handleSubmit: handleFormSubmit,
    handleMemberSelect,
    register: register as UseFormRegister<IndividualInscriptionFormInputs>,
  };
}
