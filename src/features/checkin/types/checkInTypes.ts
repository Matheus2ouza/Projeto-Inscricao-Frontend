import type {
  InscriptionStatus,
  StatusPayment,
} from "@/features/payments/types/paymentsDetails.types";

export type CheckInAccount = {
  id: string;
  username: string;
  status: string;
  countDebt: number;
  countPay: number;
  countInscriptions: number;
};

export type CheckInEventInfo = {
  id: string;
  name: string;
  imageUrl: string | null;
  countAccounts: number;
  amountCollected: number;
  totalDebt: number;
};

export type AccountsPaginatedResponse = {
  accounts: CheckInAccount[];
  total: number;
  page: number;
  pageCount: number;
};

export type FindAccountsToCheckInResponse = AccountsPaginatedResponse;

export type PaymentInscription = {
  value: number;
  status: StatusPayment;
  image: string;
  createdAt: Date;
};

export type Participants = {
  name: string;
  gender: string;
  birthDate: Date;
  typeInscription: string;
}[];

export type Inscriptions = {
  id: string;
  responsible: string;
  email?: string;
  status: InscriptionStatus;
  totalPayd: number;
  totalDebt: number;
  createdAt: Date;
  participants: Participants;
  paymentInscription: PaymentInscription[];
}[];

export type FindAccountsDetailsResponse = {
  id: string;
  username: string;
  email: string;
  status: string;
  countDebt: number;
  countPay: number;
  countInscriptions: number;
  countParticipants: number;
  inscriptions: Inscriptions;
};
