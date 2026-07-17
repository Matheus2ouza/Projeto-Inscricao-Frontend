export const genderOptions = [
  { value: 'MASCULINO', label: 'Masculino' },
  { value: 'FEMININO', label: 'Feminino' },
];
export const shirtSizeOptions = [
  { value: 'PP', label: 'PP' },
  { value: 'P', label: 'P' },
  { value: 'M', label: 'M' },
  { value: 'G', label: 'G' },
  { value: 'GG', label: 'GG' },
  { value: 'XG', label: 'XG' },
];
export const shirtTypeOptions = [
  { value: 'TRADICIONAL', label: 'Tradicional' },
  { value: 'BABYLOOK', label: 'Babylook' },
];

export type ParticipantFieldRule = 'required' | 'optional' | 'hidden';

export type ParticipantFieldsConfig = Record<
  'cpf' | 'preferredName' | 'shirtSize' | 'shirtType',
  ParticipantFieldRule
>;

export enum InscriptionStatus {
  PENDING = 'PENDING',
  UNDER_REVIEW = 'UNDER_REVIEW',
  PAID = 'PAID',
  CANCELLED = 'CANCELLED',
}

export enum StatusPayment {
  APPROVED = 'APPROVED',
  UNDER_REVIEW = 'UNDER_REVIEW',
  REFUSED = 'REFUSED',
}

export enum GenderType {
  MASCULINO = 'MASCULINO',
  FEMININO = 'FEMININO',
}

export enum PaymentMethod {
  DINHEIRO = 'DINHEIRO',
  PIX = 'PIX',
  CARTAO = 'CARTAO',
}

export enum ShirtSize {
  PP = 'PP',
  P = 'P',
  M = 'M',
  G = 'G',
  GG = 'GG',
  XG = 'XG',
}

export enum ShirtType {
  TRADICIONAL = 'TRADICIONAL',
  BABYLOOK = 'BABYLOOK',
}

export type InscriptionDetails = {
  id: string;
  status: InscriptionStatus;
  guestEmail: string;
  guestName: string;
  phone: string;
  createdAt: Date;
  totalValue: number;
  totalPaid: number;
  locality: Locality;
  participant: Participant;
  payments?: Payment[];
  participanteConfig: ParticipantFieldsConfig;
};

export type TypeInscription = {
  description: string;
  price: number;
};

export type Locality = {
  id: string;
  name: string;
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

export type GuestInscriptionDetailsResponse = {
  id: string;
  status: InscriptionStatus;
  guestEmail: string;
  guestName: string;
  phone: string;
  createdAt: Date;
  totalValue: number;
  totalPaid: number;
  locality: Locality;
  participant: Participant;
  payments?: Payment[];
  participanteConfig: ParticipantFieldsConfig;
};

export type UseDetailsInscriptionParams = {
  confirmationCode: string;
};

export type UseDetailsInscriptionResult = {
  inscription: InscriptionDetails | null;
  participant: Participant | null;
  payments: Payment[] | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
};
