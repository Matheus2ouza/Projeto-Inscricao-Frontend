enum PaymentMethod {
  DINHEIRO = "DINHEIRO",
  PIX = "PIX",
  CARTAO = "CARTAO",
}

export type GenaratePdfReportInput = {
  eventId: string;
};

export type GenaratePdfReportOutput = {
  pdfBase64: string;
  filename: string;
};

export type ReportGeneralInput = {
  eventId: string;
};

export type ReportGeneralResponse = {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  image: string;
  totalInscriptions: number;
  countTypeInscription: number;
  countParticipants: number;
  totalValue: number;
  totalDebt: number;
  typeInscription: TypeInscription;
  inscriptionAvuls: InscriptionAvuls;
  ticketSale: TicketSale;
  expenses: ExpensesReport;
  gastos: ExpensesReport;
};

export type TypeInscription = {
  id: string;
  description: string;
  amount: number;
  countParticipants: number;
  totalValue: number;
}[];

export type InscriptionAvuls = {
  countParticipants: number;
  totalValue: number;
  byPaymentMethod: AvulsoPaymentMethodReport[];
};

export type AvulsoPaymentMethodReport = {
  paymentMethod: PaymentMethod;
  countParticipants: number;
  totalValue: number;
};

export type TicketSale = {
  totalSales: number;
  totalTicketsSold: number;
  byTicket: TicketSaleByTicket[];
  byPaymentMethod: TicketSaleByPaymentMethod[];
};

export type TicketSaleByTicket = {
  ticketId: string;
  ticketName: string;
  quantity: number;
  totalValue: number;
};

export type TicketSaleByPaymentMethod = {
  paymentMethod: PaymentMethod;
  count: number;
  totalValue: number;
};

export type ExpensesReport = {
  total: number;
  totalDinheiro: number;
  totalPix: number;
  totalCartao: number;
  gastos: ExpenseDetail[];
};

export type ExpenseDetail = {
  id: string;
  description: string;
  value: number;
  paymentMethod: PaymentMethod;
  responsible: string;
  createdAt: Date;
  updatedAt: Date;
};

export type UseReportGeneralResult = {
  data: ReportGeneralResponse | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  isFetching: boolean;
};
