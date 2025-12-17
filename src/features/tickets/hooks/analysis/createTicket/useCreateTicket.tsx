"use client";

import { createTicket } from "@/features/tickets/api/analysis/createTicket/createTicket";
import { schema } from "@/features/tickets/schema/analysis/createTicket/create-ticket.schema";
import { ticketsKeys } from "@/features/tickets/types/analysis/ticketsTypes";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

export type CreateTicketFormType = z.input<typeof schema>;
type CreateTicketFormValues = z.infer<typeof schema>;

const getTodayInputDate = () => {
  const now = new Date();
  const timezoneOffset = now.getTimezoneOffset();
  const local = new Date(now.getTime() - timezoneOffset * 60 * 1000);
  return local.toISOString().split("T")[0];
};

export function useCreateTicket(eventId: string) {
  const queryClient = useQueryClient();
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<CreateTicketFormType>({
    resolver: zodResolver(schema, undefined, { raw: true }),
    defaultValues: {
      name: "",
      quantity: "",
      price: "",
      validity: getTodayInputDate(),
      description: "",
    },
  });

  async function onCreate(values: CreateTicketFormType) {
    setSubmitting(true);

    try {
      const input: CreateTicketFormValues = schema.parse(values);

      const payload = {
        eventId,
        name: input.name,
        description: input.description || undefined,
        quantity: input.quantity,
        price: input.price,
        expirationDate: input.validity,
      };

      const result = await createTicket(payload);

      toast.success("Ticket criado com sucesso", {
        description: `ID: ${result.id}`,
      });

      await queryClient.invalidateQueries({
        queryKey: ticketsKeys.byEvent(eventId),
      });

      form.reset();
      return true;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erro ao criar ticket";
      toast.error(message);
      return false;
    } finally {
      setSubmitting(false);
    }
  }

  const onSubmit = async (event?: React.BaseSyntheticEvent) => {
    let success = false;
    const handler = form.handleSubmit(async (values) => {
      success = (await onCreate(values)) ?? false;
    });

    if (event) {
      await handler(event);
    } else {
      await handler();
    }

    return success;
  };

  return { form, onSubmit, submitting };
}
