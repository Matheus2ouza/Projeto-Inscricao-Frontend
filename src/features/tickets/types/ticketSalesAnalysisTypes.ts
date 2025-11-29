import type { PaymentMethod } from "@/features/avulsa/types/avulsaTypes";
import type { StatusPayment } from "./ticketSaleGroupTypes";

export type TicketSaleStatus = StatusPayment;

export type TicketSaleAnalysisItem = {
  id: string;
  ticketName: string;
  quantity: number;
  pricePerTicket: number;
  totalValue: number;
};

export type TicketSaleAnalysisPayment = {
  id: string;
  paymentMethod: PaymentMethod;
  value: number;
  imageUrl: string;
  createdAt: string;
};

export type TicketSaleAnalysis = {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: TicketSaleStatus;
  totalValue: number;
  payments: TicketSaleAnalysisPayment;
  TicketSaleItem: TicketSaleAnalysisItem[];
};

export type TicketSalesAnalysisEvent = {
  id: string;
  name: string;
  imageUrl: string;
  TicketSales: TicketSaleAnalysis[];
};

export type AnalysisPreSaleRequest = {
  eventId: string;
  page: number;
  pageSize: number;
};

export type AnalysisPreSaleResponse = {
  event: TicketSalesAnalysisEvent;
  total: number;
  page: number;
  pageCount: number;
};
