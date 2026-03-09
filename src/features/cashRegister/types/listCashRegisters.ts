export enum CashRegisterStatus {
  OPEN = "OPEN",
  CLOSED = "CLOSED",
}

export type ListCashRegistersParams = {
  status?: CashRegisterStatus[];
  initialPage?: number;
  pageSize?: number;
};

export type ListCashRegistersResponse = {
  cashRegisters: CashRegister[];
  total: number;
  page: number;
  pageCount: number;
};

export type CashRegister = {
  id: string;
  name: string;
  status: CashRegisterStatus;
  balance: number;
  openedAt: Date;
  closedAt?: Date;
  createdAt: Date;
};

export type UseListCashRegistersResult = {
  cashRegisters: CashRegister[] | null;
  total: number;
  page: number;
  pageCount: number;
  loading: boolean;
  error: string | null;
  setPage: (page: number) => void;
  refetch: () => Promise<void>;
};
