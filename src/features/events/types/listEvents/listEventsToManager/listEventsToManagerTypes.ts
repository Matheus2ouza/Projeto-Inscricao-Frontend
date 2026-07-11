export type StatusEvent = 'OPEN' | 'CLOSE' | 'FINALIZED';
export const STATUS_EVENT_VALUES: StatusEvent[] = [
  'OPEN',
  'CLOSE',
  'FINALIZED',
];

export type ListEventsResponse = {
  events: Event[];
  total: number;
  page: number;
  pageCount: number;
};

export type Event = {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  quantityParticipants: number;
  amountCollected: number;
  url: string;
  imageUrl?: string;
  logoUrl?: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  status: string;
  active: boolean;
  paymentEnebled: boolean;
  ticketEnabled: boolean;
  regionId: string;
  regionName?: string;
  createdAt: string;
  updatedAt: string;
  countTypeInscriptions?: number;
  typesInscriptions: TypeInscription[];
  responsibles?: Responsible[];
  description?: string;
  maxParticipants?: number;
  ticketPrice?: number;
  allowCard?: boolean;
  address?: string;
};

export type TypeInscription = {
  description: string;
  value: number;
};

export type Responsible = {
  id: string;
  name: string;
};

export type UseEventsParams = {
  initialPage?: number;
  pageSize?: number;
  status?: StatusEvent[];
};

export type UseEventsResult = {
  events: Event[];
  total: number;
  page: number;
  pageCount: number;
  loading: boolean;
  error: string | null;
  setPage: (p: number) => void;
  refetch: () => Promise<void>;
};
