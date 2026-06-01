'use client';

import { registerTicketSaleGroup } from '@/features/tickets/api/register-sales/registerTicketSaleGroup';
import { ticketDetailsKeys } from '@/features/tickets/hooks/ticketDetails/useTicketDetails';
import {
  SaleGrupOutput,
  SaleGrupRequest,
} from '@/features/tickets/types/register-sale/ticketSaleRegisterTypes';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export function useTicketSaleRegister(ticketId?: string) {
  const queryClient = useQueryClient();
  const mutation = useMutation<SaleGrupOutput, Error, SaleGrupRequest>({
    mutationFn: registerTicketSaleGroup,
    onSuccess: () => {
      toast.success('Venda registrada');
      if (ticketId) {
        queryClient.invalidateQueries({
          queryKey: ticketDetailsKeys.detail(ticketId),
        });
      }
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const register = (payload: SaleGrupRequest) => mutation.mutateAsync(payload);

  return {
    ...mutation,
    register,
  };
}
