export enum InscriptionStatus {
  PENDING = "PENDING",
  UNDER_REVIEW = "UNDER_REVIEW",
  PAID = "PAID",
  CANCELLED = "CANCELLED",
}

export enum StatusPayment {
  APPROVED = "APPROVED",
  UNDER_REVIEW = "UNDER_REVIEW",
  REFUSED = "REFUSED",
}

export enum GenderType {
  MASCULINO = "MASCULINO",
  FEMININO = "FEMININO",
}

export enum PaymentMethod {
  DINHEIRO = "DINHEIRO",
  PIX = "PIX",
  CARTAO = "CARTAO",
}

export enum ShirtSize {
  PP = "PP",
  P = "P",
  M = "M",
  G = "G",
  GG = "GG",
  XG = "XG",
}

export enum ShirtType {
  TRADICIONAL = "TRADICIONAL",
  BABYLOOK = "BABYLOOK",
}

export type InscriptionDetails = {
  id: string;
  status: InscriptionStatus;
  guestEmail: string;
  guestName: string;
  guestLocality: string;
  phone: string;
  createdAt: Date;
  totalValue: number;
  totalPaid: number;
  participants: Participant[];
  payments: Payment[];
};

export type TypeInscription = {
  description: string;
  price: number;
};

export type Participant = {
  id: string;
  name: string;
  birthDate: Date;
  preferredName?: string;
  shirtSize?: ShirtSize;
  shirtType?: ShirtType;
  gender: GenderType;
  typeInscription: TypeInscription;
};

export type Payment = {
  id: string;
  status: StatusPayment;
  method: PaymentMethod;
  installments: number;
  rejectionReason?: string;
  imageUrl?: string;
  totalValue: number;
  totalPaid: number;
  paidInstallments: number;
  paymentInstallment: PaymentInstallment[];
};

export type PaymentInstallment = {
  id: string;
  installmentNumber: number;
  value: number;
  paidAt?: Date;
};

export type DetailsInscriptionParams = {
  confirmationCode: string;
};

export type DetailsInscriptionResult = {
  inscription: InscriptionDetails | null;
  participants: Participant[] | null;
  payments: Payment[] | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
};
