"use client";

import { usePreSale } from "@/features/tickets/hooks/usePreSale";
import type { TicketsByEventResponse } from "@/features/tickets/types/ticketsTypes";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  checkoutBuyerSchema,
  ticketsSelectionSchema,
  type CheckoutBuyerFormValues,
  type CheckoutBuyerFormValuesOutput,
  type TicketsSelectionItem,
} from "../schema/preSale.schema";

type CheckoutSummaryItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  available: number;
};

function buildSummaryItems(
  event: TicketsByEventResponse,
  selection: TicketsSelectionItem[]
): CheckoutSummaryItem[] {
  const ticketMap = new Map(event.tickets.map((ticket) => [ticket.id, ticket]));
  return selection
    .map((selected) => {
      const ticket = ticketMap.get(selected.ticketId);
      if (!ticket || selected.quantity <= 0) {
        return null;
      }

      return {
        id: ticket.id,
        name: ticket.name,
        price: ticket.price,
        quantity: selected.quantity,
        available: ticket.available,
      } satisfies CheckoutSummaryItem;
    })
    .filter(Boolean) as CheckoutSummaryItem[];
}

type CheckoutHookOptions = {
  onSuccess?: () => void;
};

export function useCheckoutSaleTicket(
  eventId: string,
  event: TicketsByEventResponse,
  options: CheckoutHookOptions = {}
) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const ticketsParam = searchParams.get("tickets");

  const parsedSelection = useMemo(() => {
    if (!ticketsParam) return [] as TicketsSelectionItem[];
    try {
      const parsed = JSON.parse(ticketsParam);
      const validation = ticketsSelectionSchema.safeParse(parsed);
      if (!validation.success) {
        console.error("Seleção de tickets inválida", validation.error);
        return [] as TicketsSelectionItem[];
      }
      return validation.data;
    } catch (parseError) {
      console.error("Erro ao interpretar tickets do checkout", parseError);
      return [] as TicketsSelectionItem[];
    }
  }, [ticketsParam]);

  const summaryItems = useMemo(
    () => buildSummaryItems(event, parsedSelection),
    [event, parsedSelection]
  );

  const totalAmount = summaryItems.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [receiptImage, setReceiptImage] = useState<string | null>(null);

  const form = useForm<
    CheckoutBuyerFormValues,
    any,
    CheckoutBuyerFormValuesOutput
  >({
    resolver: zodResolver(checkoutBuyerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
    },
  });

  const preSale = usePreSale(eventId);

  const handleProofSubmit = async (payload: { value: number; image: string }) => {
    if (!payload.image) {
      throw new Error("Selecione uma imagem válida.");
    }

    if (totalAmount > 0 && Math.abs(payload.value - totalAmount) > 0.1) {
      toast.warning("O valor informado difere do total calculado. Confirme os dados.");
    }

    setReceiptImage(payload.image);
    toast.success("Comprovante anexado com sucesso!");
  };

  const handleRemoveReceipt = () => {
    setReceiptImage(null);
  };

  const handleSubmit = form.handleSubmit(async (values) => {
    if (!summaryItems.length) {
      toast.error("Nenhum ticket selecionado para finalizar.");
      return;
    }

    if (!receiptImage) {
      toast.error("Anexe o comprovante de pagamento para continuar.");
      return;
    }

    try {
      await preSale.mutateAsync({
        eventId,
        name: `${values.firstName.trim()} ${values.lastName.trim()}`.trim(),
        email: values.email.trim(),
        phone: values.phone || undefined,
        totalValue: totalAmount,
        image: receiptImage,
        tickets: summaryItems.map((item) => ({
          ticketId: item.id,
          quantity: item.quantity,
        })),
      });

      toast.success("Pedido enviado! Em breve entraremos em contato.");
      if (options.onSuccess) {
        options.onSuccess();
      } else {
        router.push(`/events/tickets/${eventId}`);
      }
    } catch (submitError) {
      const message =
        submitError instanceof Error
          ? submitError.message
          : "Falha ao enviar sua solicitação de compra.";
      toast.error(message);
    }
  });

  const canSubmit =
    summaryItems.length > 0 &&
    !!receiptImage &&
    totalAmount > 0 &&
    !preSale.isPending;

  const showEmptySelection = !parsedSelection.length;

  return {
    form,
    handleSubmit,
    summaryItems,
    totalAmount,
    receiptImage,
    handleProofSubmit,
    handleRemoveReceipt,
    isDialogOpen,
    setIsDialogOpen,
    canSubmit,
    showEmptySelection,
    parsedSelection,
    isSubmitting: preSale.isPending,
  };
}
