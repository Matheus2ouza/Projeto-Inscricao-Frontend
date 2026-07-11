export enum StatusPayment {
  APPROVED = 'approved',
  UNDER_REVIEW = 'under_review',
  REFUSED = 'refused',
}

export type RegisterPaymentResponse = {
  id: string;
  status: StatusPayment;
};

type inscription = {
  id: string;
};

export type RegisterPaymentInput = {
  accountId: string;
  totalValue: number;
  image: string;
  inscriptions: inscription[];
};
