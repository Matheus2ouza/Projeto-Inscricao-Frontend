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
  description: string;
  value: number;
  paymentMethod: PaymentMethod;
  responsible: string;
  category: CategoryExpense;
  images: string[];
  createdAt: Date;
};

export type DetailsExpenseResponse = Expense;

export type DetailsExpensesParams = {
  expenseId?: string;
};

export type DetailsExpensesResult = {
  expense: Expense | null;
  loading: boolean;
  fetching: boolean;
  fetched: boolean;
  error: string | null;
  refresh: () => void;
};
