'use client';

import { useGlobalLoading } from '@/components/GlobalLoading';
import { registerIndividualInscriptionAction } from '@/features/inscriptions/actions/individualInscription/registerIndividualInscriptionAction';
import {
  IndividualInscriptionSchemaType,
  individualInscriptionSchema,
} from '@/features/inscriptions/schema/inscriptionIndiv/individualInscriptionSchema';
import { MemberDisplayData } from '@/features/inscriptions/types/individualInscription/individualInscriptionTypes';
import { IncompleteMember } from '@/features/inscriptions/types/individualInscription/registerIndividualInscriptionTypes';
import { useInvalidateMembersQuery } from '@/features/members/hook/useMembersQuery';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

export type UseFormIndividualInscriptionReturn = {
  form: ReturnType<typeof useForm<IndividualInscriptionSchemaType>>;
  onSubmit: (event?: React.BaseSyntheticEvent) => Promise<void>;
  isLoading: boolean;
  member: MemberDisplayData | null;
  addMember: (member: MemberDisplayData) => void;
  removeMember: () => void;
  incompleteMembers: IncompleteMember[] | null;
  clearIncompleteMembers: () => void;
};

export function useFormIndividualInscription(
  eventId: string,
  localityId: string,
): UseFormIndividualInscriptionReturn {
  const { setLoading } = useGlobalLoading();
  const [isLoading, setIsLoading] = useState(false);
  const [member, setMember] = useState<MemberDisplayData | null>(null);
  const [incompleteMembers, setIncompleteMembers] = useState<
    IncompleteMember[] | null
  >(null);
  const { invalidateLists } = useInvalidateMembersQuery();

  const form = useForm<IndividualInscriptionSchemaType>({
    resolver: zodResolver(individualInscriptionSchema),
    defaultValues: {
      responsible: '',
      email: '',
      phone: '',
    },
    mode: 'onChange',
  });

  const addMember = (newMember: MemberDisplayData) => {
    setMember(newMember);
    toast.success('Membro selecionado!');
  };

  const removeMember = () => {
    setMember(null);
    toast.info('Membro removido');
  };

  const clearIncompleteMembers = () => setIncompleteMembers(null);

  async function onIndividualSubmit(input: IndividualInscriptionSchemaType) {
    setIsLoading(true);
    setLoading(true);
    setIncompleteMembers(null);

    try {
      if (!member) {
        toast.warning('É necessário selecionar um membro na inscrição');
        return;
      }

      const result = await registerIndividualInscriptionAction({
        eventId,
        localityId,
        responsible: input.responsible,
        email: input.email || undefined,
        phone: input.phone,
        member: {
          accountParticipantId: member.accountParticipantId,
          typeInscriptionId: member.typeInscriptionId,
        },
      });

      if (!result.success) {
        if (result.incompleteMembers?.length) {
          setIncompleteMembers(result.incompleteMembers);
        }
        toast.error(
          result.incompleteMembers?.length
            ? 'O membro está com o cadastro incompleto'
            : 'Erro ao tentar realizar a inscrição',
          {
            description: result.message,
            richColors: true,
          },
        );
        return;
      }

      toast.success('Inscrição realizada com sucesso!', {
        description: `ID da inscrição: ${result.data.id}`,
      });

      invalidateLists();
      setMember(null);
      form.reset();
    } finally {
      setIsLoading(false);
      setLoading(false);
    }
  }

  const onSubmit = async (event?: React.BaseSyntheticEvent) => {
    await form.handleSubmit(onIndividualSubmit)(event);
  };

  return {
    form,
    member,
    addMember,
    removeMember,
    onSubmit,
    isLoading,
    incompleteMembers,
    clearIncompleteMembers,
  };
}
