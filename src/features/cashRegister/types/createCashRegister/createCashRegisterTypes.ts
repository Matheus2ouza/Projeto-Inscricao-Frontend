export enum CashRegisterStatus {
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
}

export type CreateCashInput = {
  name: string;
  regionId?: string;
  status: CashRegisterStatus;
  balance: number;
  allocationEvent: string;
};

export type CreateCashResponse = {
  id: string;
  message?: string;
};
