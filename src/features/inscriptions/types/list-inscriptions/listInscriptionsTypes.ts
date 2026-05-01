export enum InscriptionStatus {
  PENDING = 'PENDING',
  UNDER_REVIEW = 'UNDER_REVIEW',
  PAID = 'PAID',
  EXPIRED = 'EXPIRED',
  CANCELLED = 'CANCELLED',
}

export type Inscription = {
  id: string;
  responsible: string;
  status: InscriptionStatus;
  isGuest: boolean;
  totalParticipant: number;
};

export type Event = {
  id: string;
  name: string;
  image: string;
  startDate: string;
  endDate: string;
  totalInscription: number;
  totalGuestInscription?: number;
  totalParticipants: number;
  totalPaid: number;
  totalDue: number;
  inscriptions: Inscription[];
};

export type getListInscriptionsParams = {
  eventId: string;
  status?: InscriptionStatus[];
  isGuest?: boolean;
  orderByCreatedAt?: 'asc' | 'desc';
  orderByResponsible?: 'asc' | 'desc';
  period?: string;
  responsible?: string;
  page: number;
  pageSize: number;
};

export type ListInscriptionsResponse = {
  event: Event;
  total: number;
  page: number;
  pageCount: number;
};

export type ListInscriptionsParams = {
  eventId: string;
  initialPage: number;
  pageSize: number;
  status?: InscriptionStatus[];
  isGuest?: boolean;
  orderByCreatedAt?: 'asc' | 'desc';
  orderByResponsible?: 'asc' | 'desc';
  period?: string;
  responsible?: string;
};

export type ListInscriptionsResult = {
  event: Event | null;
  inscriptions: Inscription[];
  total: number;
  page: number;
  pageCount: number;
  loading: boolean;
  fetching: boolean;
  fetched: boolean;
  error: Error | null;
  setPage: (page: number) => void;
  refresh: () => void;
};
