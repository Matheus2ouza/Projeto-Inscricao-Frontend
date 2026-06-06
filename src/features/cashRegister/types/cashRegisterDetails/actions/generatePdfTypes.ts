export type generatePdfParams = {
  cashRegisterId: string;
  listExpenseCategory: boolean;
  moviments: boolean;
  favorite: boolean;
};

export type generatePdfResponse = {
  fileBase64: string;
  filename: string;
  contentType: 'application/pdf' | 'application/zip';
};
