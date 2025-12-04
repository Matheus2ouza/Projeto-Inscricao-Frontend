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

export type PaymentInscriptionOutput = {
  value: number;
  status: string;
  image: string;
  createdAt: string;
};

export type Participants = {
  name: string;
  gender: string;
  birthDate: string;
  typeInscription: string;
}[];

export type Inscriptions = {
  id: string;
  status: string;
  totalPayd: number;
  totalDebt: number;
  createdAt: string;
  participants: Participants;
  paymentInscription: PaymentInscriptionOutput[];
}[];

export type CheckInAccountDetailsData = {
  id: string;
  username: string;
  email: string;
  status: string;
  countDebt: number;
  countPay: number;
  countInscriptions: number;
  inscriptions: Inscriptions;
};
