import { TypeInscriptions } from "@/features/typeInscription/types/typesInscriptionsTypes";

export type Responsible = {
  id: string;
  name: string;
};

export type Event = {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  quantityParticipants: number;
  amountCollected: number;
  imageUrl?: string;
  logoUrl?: string;
  location?: string;
  latitude?: number | null;
  longitude?: number | null;
  status: string;
  paymentEnabled: boolean;
  ticketEnabled: boolean;
  regionId: string;
  regionName?: string;
  createdAt: string;
  updatedAt: string;
  countTypeInscriptions?: number;
  typesInscriptions: TypeInscriptions[];
  responsibles?: Responsible[];
  description?: string;
  maxParticipants?: number;
  ticketPrice?: number;
  address?: string;
};

export type EventsListQueryParams = {
  page: number;
  pageSize: number;
};

export type EventsListResponse = {
  events: Event[];
  total: number;
  page: number;
  pageCount: number;
};

type UseEventsListResult = {
  events: Event[];
  total: number;
  page: number;
  pageCount: number;
  loading: boolean;
  error: string | null;
  setPage: (page: number) => void;
  refetch: () => Promise<void>;
};

export type UseEventsForPaymentParams = {
  initialPage?: number;
  pageSize?: number;
};

export type UseEventsForPaymentResult = UseEventsListResult;

export type UseTicketsEventsParams = {
  initialPage?: number;
  pageSize?: number;
};

export type UseTicketsEventsResult = UseEventsListResult;
