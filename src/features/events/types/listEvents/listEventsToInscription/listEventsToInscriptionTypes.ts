export type StatusEvent = 'OPEN' | 'CLOSE' | 'FINALIZED';

export enum InscriptionMode {
  NORMAL = 'NORMAL',
  GUEST = 'GUEST',
}

export type ListEventsToInscriptionParams = {
  page: number;
  pageSize: number;
  status?: StatusEvent[];
};

export type ListEventsToInscriptionResponse = {
  events: Event[];
  total: number;
  page: number;
  pageCount: number;
};

export type Event = {
  id: string;
  name: string;
  imageUrl: string;
  status: StatusEvent;
  allowedInscriptionModes: InscriptionMode[];
  startDate: string;
  endDate: string;
  location?: string;
  countInscriptions: number;
  countGuestInscriptions: number;
  countInscriptionsAnalysis: number;
  countSingleInscriptions: number;
  countSingleDebit: number;
};

export type UseListEventsToInscriptionParams = {
  initialPage?: number;
  pageSize?: number;
  status?: StatusEvent[];
};

export type UseListEventsToInscriptionResult = {
  events: Event[];
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
