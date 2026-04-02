export enum InscriptionStatus {
  PENDING = "PENDING",
  UNDER_REVIEW = "UNDER_REVIEW",
  PAID = "PAID",
  EXPIRED = "EXPIRED",
  CANCELLED = "CANCELLED",
}

export type GenderType = "MASCULINO" | "FEMININO";
export type ShirtSizeType = "PP" | "P" | "M" | "G" | "GG" | "XG";
export type ShirtType = "TRADICIONAL" | "BABYLOOK";

export type Inscription = {
  id: string;
  responsible: string;
  email?: string;
  phone?: string;
  status: InscriptionStatus;
  observation?: string;
  totalValue: number;
  totalPaid: number;
  totalDebt: number;
  createdAt: Date;
  expiresAt: Date;
};

export type Participant = {
  id: string;
  name: string;
  preferredName?: string;
  cpf?: string;
  typeInscription?: string;
  birthDate: Date;
  gender: GenderType;
  shirtSize?: ShirtSizeType;
  shirtType?: ShirtType;
};

export type Payment = {
  id: string;
  paymentId: string;
  value: number;
  createdAt: Date;
};

export type PaymentLink = {
  id: string;
  url: string;
  active: boolean;
};

export type DetailsInscriptionResponse = {
  inscription: Inscription;
  participants: Participant[];
  payments: Payment[];
  paymentLink?: PaymentLink;
};

export type DetailsInscriptionParams = {
  inscriptionId: string;
};

export type DetailsInscriptionResult = {
  inscription: Inscription | null;
  participants: Participant[];
  payments: Payment[];
  paymentLink: PaymentLink | null;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
};
