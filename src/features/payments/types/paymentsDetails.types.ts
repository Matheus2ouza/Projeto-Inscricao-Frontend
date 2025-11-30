export type PaymentDetailsResponse = {
  inscription: Inscription;
};

export type Inscription = {
  id: string;
  responsible: string;
  email?: string;
  phone: string;
  status: InscriptionStatus;
  openBalance: number;
  originalValue: number;
  countParticipants: number;
  payments: PaymentSummary[];
};

export type PaymentSummary = {
  id: string;
  accountName?: string;
  status: StatusPayment;
  value: number;
  imageUrl: string;
  approvedBy?: string;
  createdAt: string;
};

export enum StatusPayment {
  APPROVED = "approved",
  UNDER_REVIEW = "under_review",
  REFUSED = "refused",
}

export enum InscriptionStatus {
  PENDING = "pending",
  UNDER_REVIEW = "under_review",
  PAID = "paid",
  CANCELLED = "cancelled",
}
