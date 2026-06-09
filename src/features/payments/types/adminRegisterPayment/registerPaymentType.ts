export type InscriptionStatus =
  | 'PENDING'
  | 'UNDER_REVIEW'
  | 'PAID'
  | 'CANCELLED'
  | 'EXPIRED';

export type RegisterPaymentInput = {
  amount: number;
  image: string | string[] | null;
  isGuest: boolean;
  guestName?: string;
  accountId?: string;
  inscriptions: InscriptionPaymentInput[];
};

export type InscriptionPaymentInput = {
  index: number;
  id: string;
  amount: number;
};

export type RegisterPaymentResponse = {
  inscriptions: InscriptionPaymentOutput[];
};

export type InscriptionPaymentOutput = {
  id: string;
  status: InscriptionStatus;
};
