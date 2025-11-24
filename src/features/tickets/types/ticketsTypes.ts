export type Ticket = {
  id: string;
  name: string;
  description?: string;
  quantity: number;
  price: number;
  expirationDate: Date;
  available: number;
};

export type TicketsByEventTicket = Omit<Ticket, "description">;

export type TicketsByEventResponse = {
  id: string;
  name: string;
  imageUrl?: string;
  quantityTicketSale: number;
  totalSalesValue: number;
  tickets: TicketsByEventTicket[];
};

export type TicketSale = {
  id: string;
  quantity: number;
  totalValue: number;
};

export type TicketDetails = {
  id: string;
  name: string;
  description?: string;
  quantity: number;
  price: number;
  available: number;
  expirationDate: string;
  isActive: boolean;
  ticketSale: TicketSale[];
};

export type CreateTicketInput = {
  eventId: string;
  name: string;
  description?: string;
  quantity: number;
  price: number;
  expirationDate: string;
};

export type CreateTicketOutput = {
  id: string;
};

export const ticketsKeys = {
  all: ["tickets"] as const,
  byEvent: (eventId: string) => [...ticketsKeys.all, "event", eventId] as const,
  detail: (ticketId: string) =>
    [...ticketsKeys.all, "detail", ticketId] as const,
};
