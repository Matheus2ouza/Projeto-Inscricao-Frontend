import type { PaymentMethod } from "@/features/avulsa/types/avulsaTypes";
import type { StatusPayment } from "./ticketSaleGroupTypes";

export type TicketSaleListItemTicket = {
  id: string;
  ticketName: string;
  quantity: number;
  pricePerTicket: number;
  totalValue: number;
};

export type TicketSaleListPayment = {
  id: string;
  paymentMethod: PaymentMethod;
  value: number;
  imageUrl: string;
  createdAt: string;
};

export type TicketSaleListItem = {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: StatusPayment;
  totalValue: number;
  payments: TicketSaleListPayment | null;
  TicketSaleItem: TicketSaleListItemTicket[];
};

export type TicketSaleListEvent = {
  id: string;
  name: string;
  imageUrl: string;
  countTicketSales: number;
  countTicketSalesPending: number;
  countTicketSalesPaid: number;
  ticketSales: TicketSaleListItem[];
};

export type ListPreSalesResponse = {
  event: TicketSaleListEvent | null;
  total: number;
  page: number;
  pageCount: number;
};
