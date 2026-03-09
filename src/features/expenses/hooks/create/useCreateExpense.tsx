"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { createExpense } from "../../api/create/createExpense";
import { CreateExpenseRequest, expensesKeys } from "../../types/expensesTypes";

const createExpenseSchema = z.object({
  description: z.string().min(1, "Descrição é obrigatória"),
  value: z.number().min(0.01, "Valor deve ser maior que zero"),
  paymentMethod: z.enum(["PIX", "CARTAO", "DINHEIRO"], {
    message: "Método de pagamento é obrigatório",
  }),
  responsible: z.string().min(1, "Responsável é obrigatório"),
});

export type CreateExpenseFormData = z.infer<typeof createExpenseSchema>;

export function useCreateExpense(eventId: string) {
  const queryClient = useQueryClient();

  const form = useForm<CreateExpenseFormData>({
    resolver: zodResolver(createExpenseSchema),
    defaultValues: {
      description: "",
      value: 0,
      paymentMethod: "PIX",
      responsible: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: CreateExpenseFormData) => {
      const expenseData: CreateExpenseRequest = {
        eventId,
        description: data.description,
        value: data.value,
        paymentMethod: data.paymentMethod,
        responsible: data.responsible,
      };
      return await createExpense(expenseData);
    },
    onSuccess: () => {
      toast.success("Gasto criado com sucesso!");
      form.reset();
      // Invalidar queries relacionadas aos gastos do evento
      queryClient.invalidateQueries({
        queryKey: expensesKeys.byEvent(eventId),
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erro ao criar gasto");
    },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      await mutation.mutateAsync(data);
      return true;
    } catch {
      return false;
    }
  });

  return {
    form,
    onSubmit,
    submitting: mutation.isPending,
  };
}
