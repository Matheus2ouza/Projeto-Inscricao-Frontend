"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { createCashRegister } from "../../api/createCashRegister/createCashRegister";
import type {
  CreateCashInput,
  CreateCashResponse,
} from "../../types/createCashRegister/createCashRegisterTypes";
import { useInvalidateListCashRegistersQuery } from "../useListCashRegistersQuery";

export function useCreateCashRegister() {
  const { invalidateLists } = useInvalidateListCashRegistersQuery();

  const { mutateAsync: createCashRegisterMutation, isPending: isCreating } =
    useMutation<CreateCashResponse, Error, CreateCashInput>({
      mutationFn: createCashRegister,
      onSuccess: (data) => {
        toast.success(data.message ?? "Caixa criado com sucesso!");
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
