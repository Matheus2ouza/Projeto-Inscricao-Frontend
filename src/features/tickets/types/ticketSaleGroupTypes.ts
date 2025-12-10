import type { PaymentMethod } from "@/features/avulsa/types/avulsaTypes";

export type StatusPayment = "PENDING" | "UNDER_REVIEW" | "PAID" | "CANCELLED";

export type SaleGroupTicketPayload = {
  ticketId: string;
  accountName: string;
  quantity: number;
  paymentMethod: PaymentMethod;
  pricePerTicket: number;
  status: StatusPayment;
};

export type SaleGroupTicketResponse = {
  id: string;
};

export const PAYMENT_METHOD_OPTIONS: Array<{
  label: string;
  value: PaymentMethod;
}> = [
    { label: "Dinheiro", value: "DINHEIRO" },
    { label: "PIX", value: "PIX" },
    { label: "Cartão", value: "CARTAO" },
  ];

export const STATUS_PAYMENT_OPTIONS: Array<{
  label: string;
  value: StatusPayment;
}> = [
    { label: "Pendente", value: "PENDING" },
    { label: "Em análise", value: "UNDER_REVIEW" },
    { label: "Pago", value: "PAID" },
    { label: "Cancelado", value: "CANCELLED" },
  ];
