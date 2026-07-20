import { useGlobalLoading } from '@/components/GlobalLoading';
import { GenderType } from '@/features/members/types/createMember/createMemberTypes';
import { zodResolver } from '@hookform/resolvers/zod';
import dayjs from 'dayjs';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { createMemberAction } from '../../actions/createMember/createMember';
import { membersSchema, MembersSchemaType } from '../../schema/membersSchema';
import { useInvalidateMembersQuery } from '../useMembersQuery';

export type UseFormCreateMembers = {
  form: ReturnType<typeof useForm<MembersSchemaType>>;
  onSubmit: (
    event?: React.BaseSyntheticEvent,
  ) => Promise<{ success: boolean; error?: string }>;
  isLoading: boolean;
};

export default function useFormCreateMember(
  localityId: string,
): UseFormCreateMembers {
  const [isLoading, setIsLoading] = useState(false);
  const { setLoading } = useGlobalLoading();
  const { invalidateLists } = useInvalidateMembersQuery();

  // Data de hoje no formato YYYY-MM-DD
  const today = dayjs().format('YYYY-MM-DD');

  const form = useForm<MembersSchemaType>({
    resolver: zodResolver(membersSchema),
    defaultValues: {
      name: '',
      cpf: '',
      birthDate: today,
      gender: GenderType.MASCULINO,
    },
  });

  async function onCreateMemberSubmit(
    input: MembersSchemaType,
  ): Promise<{ success: boolean; error?: string }> {
    setLoading(true);
    setIsLoading(true);
    try {
      await createMemberAction({ localityId, ...input });
      invalidateLists(); // Invalida cache
      form.reset();
      return { success: true };
    } catch (error) {
      const err = error as Error;
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
      setIsLoading(false);
    }
  }

  const onSubmit = async (
    event?: React.BaseSyntheticEvent,
  ): Promise<{ success: boolean; error?: string }> => {
    event?.preventDefault?.();

    // Valida manualmente
    const isValid = await form.trigger();
    if (!isValid) {
      return { success: false, error: 'Erro de validação' };
    }

    // Pega os dados validados
    const data = form.getValues();

    // Chama a função de submit
    return onCreateMemberSubmit(data);
  };

  return {
    form,
    onSubmit,
    isLoading,
  };
}
