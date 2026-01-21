export type RegisterPaymentDetailsResponse = {
  inscription: Inscription;
  participant: Participant[];
  payments: Payment[];
  allowCard: boolean;
  totalParticipant: number;
  totalPayment: number;
  page: number;
  pageCount: number;
};

export type Inscription = {
  id: string;
  eventId: string;
  responsible: string;
  totalValue: number;
  status: string;
  createdAt: Date;
};

export type Participant = {
  id: string;
  name: string;
  birthDate: Date;
  gender: string;
};

export type Payment = {
  id: string;
  status: string;
  totalValue: number;
  imageUrl?: string;
  rejectionReason?: string;
  createdAt: Date;
};

export type RegisterPaymentDetailsParams = {
  inscriptionId: string;
  initialPage?: number;
  pageSize?: number;
};

export type RegisterPaymentDetailsResult = {
  inscription: Inscription | null;
  participant: Participant[];
  payments: Payment[];
  allowCard: boolean;
  totalParticipant: number;
  totalPayment: number;
  page: number;
  pageCount: number;
  loading: boolean;
  error: Error | null;
  setPage: (page: number) => void;
  refresh: () => void;
};
