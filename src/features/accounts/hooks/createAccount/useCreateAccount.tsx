import {
  createAccountSchema,
  CreateAccountSchemaType,
} from '@/features/accounts/schemas/createAccount/createAccountSchema';
import { RoleType } from '@/features/accounts/types/createAccount/createAccountTypes';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { createAccountAction } from '../../actions/createAccount/registerAccountAction';
import { useInvalidateListAccountsQuery } from '../listAccounts/useListAccountsQuery';

type UseCreateAccountType = {
  form: ReturnType<typeof useForm<CreateAccountSchemaType>>;
  onSubmit: (event?: React.BaseSyntheticEvent) => Promise<void>;
  isLoading: boolean;
  createdCredentials: {
    username: string;
    password: string;
  } | null;
  clearCreatedCredentials: () => void;
};

export function useCreateAccount(): UseCreateAccountType {
  const { invalidateAll } = useInvalidateListAccountsQuery();
  const [createdCredentials, setCreatedCredentials] = useState<{
    username: string;
    password: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<CreateAccountSchemaType>({
    resolver: zodResolver(createAccountSchema),
    defaultValues: {
      username: '',
      password: '',
      role: RoleType.USER,
      regionId: undefined,
    },
  });

  async function onCreateAccountSubmit(
    input: CreateAccountSchemaType,
  ): Promise<void> {
    setIsLoading(true);

    try {
      await createAccountAction(input);

      setCreatedCredentials({
        username: input.username,
        password: input.password,
      });
      form.reset();
      invalidateAll();
      toast.success('Usuário criado com sucesso!', {
        description: `O usuário ${input.username} foi criado.`,
        richColors: true,
      });
    } catch (error) {
      const err = error as Error;
      toast.error('Erro ao tentar criar usuário', {
        description: err.message,
        richColors: true,
      });
    } finally {
      setIsLoading(false);
    }
  }

  const clearCreatedCredentials = () => {
    setCreatedCredentials(null);
  };

  const onSubmit = async (event?: React.BaseSyntheticEvent): Promise<void> => {
    await form.handleSubmit(async (data) => {
      await onCreateAccountSubmit(data);
    })(event);
  };

  return {
    form,
    onSubmit,
    isLoading,
    createdCredentials,
    clearCreatedCredentials,
  };
}
