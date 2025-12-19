"use client";

import { saleGroupTicket } from "@/features/tickets/api/ticketSales/grup/saleGroupTicket";
import { ticketsKeys } from "@/features/tickets/types/analysis/ticketsTypes";
import type { SaleGroupTicketPayload } from "@/features/tickets/types/ticketSales/grup/ticketSaleGroupTypes";
import { STATUS_PAYMENT_OPTIONS } from "@/features/tickets/types/ticketSales/grup/ticketSaleGroupTypes";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const paymentMethodValues = ["DINHEIRO", "PIX", "CARTAO"] as const;
const statusValues = ["PENDING", "UNDER_REVIEW", "PAID", "CANCELLED"] as const;

const saleGroupTicketSchema = z.object({
  accountName: z.string().min(1, { message: "Informe o nome do comprador" }),
  quantity: z
    .string()
    .min(1, { message: "Informe a quantidade de tickets" })
    .refine(
      (value) => {
        const numberValue = Number(value);
        return Number.isInteger(numberValue) && numberValue > 0;
      },
      { message: "Quantidade deve ser um número inteiro maior que 0" }
    ),
  paymentMethod: z.enum(paymentMethodValues),
  pricePerTicket: z
    .string()
    .min(1, { message: "Informe o valor por ticket" })
    .refine(
      (value) => {
        const numberValue = Number(value);
        return !Number.isNaN(numberValue) && numberValue >= 0;
      },
      { message: "Informe um valor numérico válido" }
    ),
  status: z.enum(statusValues),
});

export type SaleGroupTicketFormValues = z.infer<typeof saleGroupTicketSchema>;

export function useSaleGroupTicket(ticketId: string) {
  const queryClient = useQueryClient();
  const [submitting, setSubmitting] = useState(false);

  const getDefaultValues = (): SaleGroupTicketFormValues => ({
    accountName: "",
    quantity: "",
    paymentMethod: paymentMethodValues[0],
    pricePerTicket: "",
    status: STATUS_PAYMENT_OPTIONS[0].value,
  });

  const form = useForm<SaleGroupTicketFormValues>({
    resolver: zodResolver(saleGroupTicketSchema),
    defaultValues: getDefaultValues(),
  });

  async function submit(values: SaleGroupTicketFormValues) {
    if (!ticketId) {
      toast.error("Ticket inválido para registrar venda em grupo");
      return false;
    }

    setSubmitting(true);

    try {
      const payload: SaleGroupTicketPayload = {
        ticketId,
        accountName: values.accountName,
        quantity: Number(values.quantity),
        paymentMethod: values.paymentMethod,
        pricePerTicket: Number(values.pricePerTicket),
        status: values.status,
      };

      const result = await saleGroupTicket(payload);

      toast.success("Venda registrada com sucesso", {
        description: `ID da venda: ${result.id}`,
      });

      await queryClient.invalidateQueries({
        queryKey: ticketsKeys.detail(ticketId),
      });

      form.reset(getDefaultValues());

      return true;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Erro ao registrar venda em grupo";
      toast.error(message);
      return false;
    } finally {
      setSubmitting(false);
    }
  }

  return {
    form,
    submitting,
    submit,
    reset: (values?: Partial<SaleGroupTicketFormValues>) =>
      form.reset({ ...getDefaultValues(), ...values }),
  };
}
