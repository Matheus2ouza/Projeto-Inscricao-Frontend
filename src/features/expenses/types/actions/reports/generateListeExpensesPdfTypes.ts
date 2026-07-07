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

export enum PaymentMethod {
  DINHEIRO = 'DINHEIRO',
  PIX = 'PIX',
  CARTAO = 'CARTAO',
}

export type GenerateListeExpensesPdfInput = {
  eventId: string;

  // filters
  category?: CategoryExpense[];
  paymentMethod?: PaymentMethod[];
  startCreatedAt?: Date | string;
  endCreatedAt?: Date | string;
};

export type GenerateListeExpensesPdfResponse = {
  filename: string;
  fileBase64?: string;
  contentType: 'application/pdf';
};
