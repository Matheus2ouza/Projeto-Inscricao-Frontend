export type DetailsInscriptionResponse = {
  inscription: Inscription;
  participants: Participant[];
  payments: Payment[];
};

export type Inscription = {
  id: string;
  responsible: string;
  email?: string;
  phone?: string;
  status: string;
  totalValue: number;
  totalPaid: number;
  totalDebt: number;
  createdAt: Date;
};

export type Participant = {
  id: string;
  typeInscription: string | undefined;
  name: string;
  birthDate: Date;
  gender: string;
};

export type Payment = {
  id: string;
  value: number;
  createdAt: Date;
};

export type DetailsInscriptionsParams = {
  inscriptionId: string;
};

export type UseMyInscriptionsResult = {
  inscription: Inscription | null;
  participants: Participant[];
  payments: Payment[];
  loading: boolean;
  fetching: boolean;
  fetched: boolean;
  error: Error | null;
  refresh: () => void;
};

export type UpdateInscriptionInput = {
  responsible: string;
  email?: string;
  phone?: string;
};
