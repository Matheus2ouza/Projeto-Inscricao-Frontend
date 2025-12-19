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
  ticketEnabled: boolean;
  tickets: TicketsByEventTicket[];
};

export type PreSaleTicketInput = {
  ticketId: string;
  quantity: number;
};

export type PreSaleInput = {
  eventId: string;
  name: string;
  email: string;
  phone?: string;
  totalValue: number;
  image: string;
  tickets: PreSaleTicketInput[];
};

export type PreSaleOutput = {
  id: string;
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
  publicByRoute: (publicRoute: string) =>
    [...ticketsKeys.all, "public-route", publicRoute] as const,
  detail: (ticketId: string) =>
    [...ticketsKeys.all, "detail", ticketId] as const,
};
