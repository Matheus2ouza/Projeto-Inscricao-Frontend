import type { PaymentMethod } from "@/features/avulsa/types/avulsaTypes";

export type TicketForSale = {
  id: string;
  name: string;
  description?: string;
  quantity: number;
  price: number;
  expirationDate: string | Date;
  available: number;
  isActive: boolean;
};

export type FindTicketsForSaleOutput = {
  id: string;
  name: string;
  imageUrl?: string;
  ticketEnabled?: boolean;
  tickets: TicketForSale[];
};

export type TicketSalePaymentInput = {
  paymentMethod: PaymentMethod;
  value: number;
};

export type TicketSaleItemInput = {
  ticketId: string;
  quantity: number;
  unitValue: number;
};

export type SaleGrupInput = {
  eventId: string;
  name: string;
  items: TicketSaleItemInput[];
  payments: TicketSalePaymentInput[];
};

export type SaleGrupRequest = SaleGrupInput;

export type TicketSaleItem = {
  id: string;
  quantity: number;
  createdAt: Date;
};

export type FindTicketDetailsResponse = {
  id: string;
  name: string;
  description: string;
  quantity: number;
  price: number;
  available: number;
  expirationDate: Date;
  isActive: boolean;
  TicketSaleItens: TicketSaleItem[];
};

export type TicketSummary = {
  id: string;
  name: string;
  description: string;
  quantity: number;
  price: number;
  available: number;
  expirationDate: Date;
  isActive: boolean;
};

export type TicketSaleHistoryItem = {
  id: string;
  quantity: number;
  createdAt: Date;
};

export type SaleGrupOutput = {
  saleId: string;
  totalUnits: number;
};
