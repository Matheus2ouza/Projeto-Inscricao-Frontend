export enum PaymentMethod {
  PIX = 'PIX',
  CARTAO = 'CARTAO',
  DINHEIRO = 'DINHEIRO',
}

export enum CategoryExpense {
  BRINDES = 'BRINDES',
  COZINHA = 'COZINHA',
  DECORACAO = 'DECORACAO',
  DECORACAO_ESTACAO = 'DECORACAO_ESTACAO',
  DECORACAO_COMPERADORES = 'DECORACAO_COMPERADORES',
  MIDIA = 'MIDIA',
  SOM = 'SOM',
  MANUTENCAO = 'MANUTENCAO',
  SEGURANCA = 'SEGURANCA',
  OUTROS = 'OUTROS',
}

export type Expense = {
  id: string;
  eventId: string;
  description: string;
  value: number;
  paymentMethod: PaymentMethod;
  category: CategoryExpense;
  images: string;
  responsible: string;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateExpenseRequest = {
  eventId?: string;
  description: string;
  value: number;
  paymentMethod: PaymentMethod;
  category: CategoryExpense;
  images: string[];
  responsible: string;
  createAt?: string;
};

export type CreateExpenseResponse = {
  id: string;
};
