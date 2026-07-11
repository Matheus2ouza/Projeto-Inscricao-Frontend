export type FindAllPaginatedInscriptionRequest = {
  limitTime?: string | null;
  page?: number;
  pageSize?: number;
};

export type FindAllPaginatedInscriptionResponse = {
  events: Events;
  total: number;
  page: number;
  pageCount: number;
  totalInscription: number;
  totalParticipant: number;
  totalDebt: number;
};

export type FindAllWithInscriptionsRequest = {
  page: number;
  pageSize: number;
};

export type Inscription = {
  id: string;
  responsible: string;
  totalValue: number;
  status: string;
};

export type Inscriptions = Inscription[];

export type Event = {
  id: string;
  name: string;
  image: string;
  startDate: string;
  endDate: string;
  totalParticipant: number;
  totalDebt: number;
  inscriptions: Inscriptions;
};

export type Events = Event[];

export type FindAllWithInscriptionsResponse = {
  events: Events;
  total: number;
  page: number;
  pageCount: number;
};

export type UsePaymentsParams = {
  initialPage?: number;
  pageSize?: number;
};

export type UsePaymentsResult = {
  events: Events;
  total: number;
  page: number;
  pageCount: number;
  loading: boolean;
  error: string | null;
  setPage: (p: number) => void;
  refetch: () => Promise<void>;
};

export type UpdateInscriptionInput = {
  responsible: string;
  phone: string;
  email?: string;
};
