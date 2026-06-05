export type PaymentMethod = 'PIX' | 'CARTAO' | 'DINHEIRO';

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
  image: string;
  responsible: string;
  createdAt: Date;
  updatedAt: Date;
};

export type ListExpensesParams = {
  eventId?: string;
  initialPage: number;
  pageSize: number;
};

export type ListExpensesResponse = {
  expenses: Expense[];
  total: number;
  page: number;
  pageCount: number;
};

export type ListExpensesResult = {
  expense: Expense[];
  total: number;
  page: number;
  pageCount: number;
  loading: boolean;
  fetching: boolean;
  fetched: boolean;
  error: Error | null;
  setPage: (page: number) => void;
  refresh: () => void;
};
