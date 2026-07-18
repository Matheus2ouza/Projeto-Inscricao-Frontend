'use client';

import { useGlobalLoading } from '@/components/GlobalLoading';
import { registerGroupInscriptionAction } from '@/features/inscriptions/actions/groupInscription/registerGroupInscriptionAction';
import {
  GroupInscriptionSchemaType,
  groupInscriptionSchema,
} from '@/features/inscriptions/schema/inscriptionGrup/grupInscriptionSchema';
import { IncompleteMember } from '@/features/inscriptions/types/groupInscription/registerGroupInscriptionTypes';
import { useInvalidateMembersQuery } from '@/features/members/hook/useMembersQuery';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { MemberDisplayData } from '../../types/groupInscription/inscriptionGrupTypes';

export type UseFormInscriptionGrupType = {
  form: ReturnType<typeof useForm<GroupInscriptionSchemaType>>;
  onSubmit: (event?: React.BaseSyntheticEvent) => Promise<void>;
  isLoading: boolean;
  members: MemberDisplayData[];
  addMember: (member: MemberDisplayData) => void;
  removeMember: (index: number) => void;
  incompleteMembers: IncompleteMember[] | null;
  clearIncompleteMembers: () => void;
};

export function useFormInscriptionGrup(
  eventId: string,
  localityId: string,
): UseFormInscriptionGrupType {
  const { setLoading } = useGlobalLoading();
  const [isLoading, setIsLoading] = useState(false);
  const [members, setMembers] = useState<MemberDisplayData[]>([]);
  const [incompleteMembers, setIncompleteMembers] = useState<
    IncompleteMember[] | null
  >(null);
  const { invalidateLists } = useInvalidateMembersQuery();

  const form = useForm<GroupInscriptionSchemaType>({
    resolver: zodResolver(groupInscriptionSchema),
    defaultValues: {
      responsible: '',
      email: undefined,
      phone: '',
    },
    mode: 'onChange',
  });

  const addMember = (member: MemberDisplayData) => {
    setMembers([...members, member]);
    toast.success('Membro adicionado à lista!');
  };

  const removeMember = (index: number) => {
    const newMembers = [...members];
    newMembers.splice(index, 1);
    setMembers(newMembers);
    toast.info('Membro removido da lista');
  };

  const clearIncompleteMembers = () => setIncompleteMembers(null);

  async function onGroupSubmit(input: GroupInscriptionSchemaType) {
    setIsLoading(true);
    setLoading(true);
    setIncompleteMembers(null);

    try {
      if (members.length === 0) {
        toast.warning(
          'É necessário adicionar pelo menos um membro na inscrição',
        );
        return;
      }

      const result = await registerGroupInscriptionAction({
        eventId,
        localityId,
        responsible: input.responsible,
        email: input.email,
        phone: input.phone,
        members: members.map((member) => ({
          accountParticipantId: member.accountParticipantId,
          typeInscriptionId: member.typeInscriptionId,
        })),
      });

      if (!result.success) {
        if (result.incompleteMembers?.length) {
          setIncompleteMembers(result.incompleteMembers);
        }
        toast.error(
          result.incompleteMembers?.length
            ? 'Alguns membros estão com o cadastro incompleto'
            : 'Erro ao tentar realizar a inscrição em grupo',
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
      setMembers([]);
      form.reset();
    } finally {
      setIsLoading(false);
      setLoading(false);
    }
  }

  const onSubmit = async (event?: React.BaseSyntheticEvent) => {
    await form.handleSubmit(onGroupSubmit)(event);
  };

  return {
    form,
    members,
    addMember,
    removeMember,
    onSubmit,
    isLoading,
    incompleteMembers,
    clearIncompleteMembers,
  };
}
