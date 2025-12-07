export type PaymentMethod = "PIX" | "CARTAO" | "DINHEIRO";

export type Expense = {
  id: string;
  eventId: string;
  description: string;
  value: number;
  paymentMethod: PaymentMethod;
  responsible: string;
  createdAt: Date;
  updatedAt: Date;
};

export type FindAllPaginatedEventExpensesRequest = {
  page?: string;
  pageSize?: string;
};

export type FindAllPaginatedEventExpensesResponse = {
  expenses: Expense[];
  total: number;
  page: number;
  pageCount: number;
};

export type CreateExpenseRequest = {
  eventId: string;
  description: string;
  value: number;
  paymentMethod: PaymentMethod;
  responsible: string;
};

export type CreateExpenseResponse = {
  id: string;
  eventId: string;
  description: string;
  value: number;
  paymentMethod: PaymentMethod;
  responsible: string;
  createdAt: Date;
  updatedAt: Date;
};

// Query keys para React Query
export const expensesKeys = {
  all: ["expenses"] as const,
  byEvent: (eventId: string) =>
    [...expensesKeys.all, "byEvent", eventId] as const,
  byEventPaginated: (eventId: string, page: number, pageSize: number) =>
    [...expensesKeys.byEvent(eventId), "paginated", page, pageSize] as const,
};
