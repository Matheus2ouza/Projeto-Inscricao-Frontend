'use client';

import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { createCashRegister } from '../../api/createCashRegister/createCashRegister';
import type {
  CreateCashInput,
  CreateCashResponse,
} from '../../types/createCashRegister/createCashRegisterTypes';
import { useInvalidateCashRegisterDetailsQuery } from '../cashRegisterDetails/cashRegisterDetailsQuery';
import { useInvalidateCashRegisterMovimentsQuery } from '../cashRegisterDetails/cashRegisterMovimentsQuery';

export function useCreateCashRegister() {
  const { invalidateDetails } = useInvalidateCashRegisterDetailsQuery();
  const { invalidateLists } = useInvalidateCashRegisterMovimentsQuery();

  const { mutateAsync: createCashRegisterMutation, isPending: isCreating } =
    useMutation<CreateCashResponse, Error, CreateCashInput>({
      mutationFn: createCashRegister,
      onSuccess: (data) => {
        toast.success(data.message ?? 'Caixa criado com sucesso!');
        invalidateDetails();
        invalidateLists();
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });

  const handleCreateCashRegister = async (
    input: CreateCashInput,
  ): Promise<CreateCashResponse> => {
    return await createCashRegisterMutation(input);
  };

  return {
    handleCreateCashRegister,
    isCreatingCashRegister: isCreating,
  };
}
