export type Event = {
  id: string;
  name: string;
  image: string;
  startDate: string;
  endDate: string;
  totalInscription: number;
  totalPaid: number;
  totalDue: number;
  inscriptions: Inscription[];
};

export type Inscription = {
  id: string;
  responsible: string;
  status: string;
  totalParticipant: number;
};

export type MyInscriptionsResponse = {
  event: Event;
  total: number;
  page: number;
  pageCount: number;
};

export type UseMyInscriptionsParams = {
  eventId: string;
  initialPage: number;
  pageSize: number;
  limitTime?: string;
};

export type UseMyInscriptionsResult = {
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
