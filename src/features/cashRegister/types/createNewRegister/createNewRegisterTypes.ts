export enum CashEntryType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
}

export enum PaymentMethod {
  DINHEIRO = 'DINHEIRO',
  PIX = 'PIX',
  CARTAO = 'CARTAO',
}

export type CreateNewRegisterInput = {
  cashRegisterId: string;
  type: CashEntryType;
  method: PaymentMethod;
  value: number;
  description?: string;
  eventId?: string;
  responsible: string;
  image?: string;
};

export type CreateNewRegisterResponse = {
  id: string;
};
