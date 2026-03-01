export enum CashRegisterStatus {
  OPEN = "OPEN",
  CLOSED = "CLOSED",
}

export type listCashRegistersResponse = {
  id: string;
  name: string;
  status: CashRegisterStatus;
  balance: number;
  openedAt: Date;
  closedAt?: Date;
  createdAt: Date;
}[];

export type CashRegisters = {
  id: string;
  name: string;
  status: CashRegisterStatus;
  balance: number;
  openedAt: Date;
  closedAt?: Date;
  createdAt: Date;
};

export type useListCashRegistersResult = {
  cashRegisters: CashRegisters[] | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
};
