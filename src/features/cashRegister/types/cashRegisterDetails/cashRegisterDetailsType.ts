export enum CashRegisterStatus {
  OPEN = "OPEN",
  CLOSED = "CLOSED",
}

export enum CashEntryType {
  INCOME = "INCOME",
  EXPENSE = "EXPENSE",
  WITHDRAWAL = "WITHDRAWAL",
}

export enum PaymentMethod {
  DINHEIRO = "DINHEIRO",
  PIX = "PIX",
  CARTAO = "CARTAO",
}

export enum CashEntryOrigin {
  ASAAS = "ASAAS",
  INTERNAL = "INTERNAL",
  ONSITE = "ONSITE",
  EXPENSE = "EXPENSE",
  TICKET = "TICKET",
  TRANSFER = "TRANSFER",
  MANUAL = "MANUAL",
}

export type AllocationEvent = {
  id: string;
  name: string;
};

export type GetCashRegisterResponse = {
  id: string;
  name: string;
  status: CashRegisterStatus;
  balance: number;
  allocationEvents: AllocationEvent[];
  totalIncome: number;
  totalExpense: number;
  totalPix: number;
  totalCard: number;
  totalCash: number;
  openedAt: Date;
  closedAt?: Date;
};

export type CashRegister = {
  id: string;
  name: string;
  status: CashRegisterStatus;
  balance: number;
  allocationEvents: AllocationEvent[];
  totalIncome: number;
  totalExpense: number;
  totalPix: number;
  totalCard: number;
  totalCash: number;
  openedAt: Date;
  closedAt?: Date;
};

export type CashRegisterDetailsParam = {
  cashRegisterId: string;
};

export type CashRegisterDetailsResult = {
  cashRegisters: CashRegister | null;
  loading: boolean;
  fetching: boolean;
  error: string | null;
  refetch: () => Promise<void>;
};

export type Moviment = {
  id: string;
  type: CashEntryType;
  origin: CashEntryOrigin;
  method: PaymentMethod;
  value: number;
  description?: string;
  eventId?: string;
  paymentInstallmentId?: string;
  onSiteRegistrationId?: string;
  eventExpenseId?: string;
  ticketSaleId?: string;
  responsible?: string;
  imageUrl?: string;
  createdAt: Date;
};

export type GetCashRegisterMovimentsResponse = {
  moviments: Moviment[];
  totalMoviments: number;
  page: number;
  pageCount: number;
};

export type CashRegisterMovimentsParam = {
  cashRegisterId: string;
  type?: CashEntryType[];
  limitTime?: string;
  orderBy?: "desc" | "asc";
  initialPage: number;
  pageSize: number;
};

export type CashRegisterMovimentsResult = {
  moviments: Moviment[] | null;
  totalMoviments: number;
  page: number;
  pageCount: number;
  loading: boolean;
  fetching: boolean;
  error: string | null;
  setPage: (page: number) => void;
  refetch: () => Promise<void>;
};
