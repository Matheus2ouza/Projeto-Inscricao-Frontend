export type TicketSaleItem = {
  id: string;
  accountName: string;
  quantity: number;
  createdAt: Date;
};

export type TicketSalePayment = {
  id: string;
  paymentMethod: string;
  value: number;
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
  ticketSalePayments: TicketSalePayment[];
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
  TicketSalePayments: TicketSalePayment[];
};
