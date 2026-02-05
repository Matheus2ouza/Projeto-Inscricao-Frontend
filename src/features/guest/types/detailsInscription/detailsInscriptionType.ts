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
export type InscriptionDetails = {
  id: string;
  status: InscriptionStatus;
  guestEmail: string;
  guestName: string;
  guestLocality: string;
  phone: string;
  createdAt: Date;
  participants: Participant[];
  payments?: Payment[];
};

export type Participant = {
  id: string;
  name: string;
  birthDate: Date;
  gender: GenderType;
  typeInscription: TypeInscription;
};

export enum PaymentMethod {
  DINHEIRO = "DINHEIRO",
  PIX = "PIX",
  CARTAO = "CARTAO",
}

export type TypeInscription = {
  description: string;
  price: number;
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
  PaymentInstallment: PaymentInstallment[];
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
  inscriptionDetails: InscriptionDetails | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
};
