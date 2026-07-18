export enum StatusPayment {
  APPROVED = 'APPROVED',
  UNDER_REVIEW = 'UNDER_REVIEW',
  REFUSED = 'REFUSED',
}

export type RegisterPaymentPixInput = {
  inscriptionIds: string[];
  name: string;
  email: string;
  value: number;
  date: string;
  file: File;
};

export type RegisterPaymentPixResponse = {
  id: string;
  status: StatusPayment;
  confirmationCode: string;
};
