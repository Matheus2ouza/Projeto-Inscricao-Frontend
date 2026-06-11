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
  favorite: boolean;
  value: number;
  description: string;
  eventId: string;
  responsible: string;
  images: string[];
  createAt?: Date;
};

export type CreateNewRegisterResponse = {
  id: string;
};
