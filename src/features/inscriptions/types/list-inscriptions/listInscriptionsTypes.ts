export type Inscription = {
  id: string;
  responsible: string;
  status: string;
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
  isGuest?: boolean;
  orderBy?: "asc" | "desc";
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
