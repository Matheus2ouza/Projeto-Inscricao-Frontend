export type TicketSaleItem = {
  id: string;
  quantity: number;
  createdAt: Date;
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
  ticketSaleItems: TicketSaleItem[];
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

