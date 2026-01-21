import { TypeInscriptions } from "@/features/typeInscription/types/typesInscriptionsTypes";

export type StatusEvent = "OPEN" | "CLOSE" | "FINALIZED";
export const STATUS_EVENT_VALUES: StatusEvent[] = [
  "OPEN",
  "CLOSE",
  "FINALIZED",
];

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
  latitude?: number;
  longitude?: number;
  status: string;
  active?: boolean;
  paymentEnebled: boolean;
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
  allowCard?: boolean;
  address?: string;
};

export type EventDto = {
  id: string;
  name: string;
};

export type UseEventsNameResult = {
  events: EventDto[];
  total: number;
  page: number;
  pageCount: number;
  loading: boolean;
  error: string | null;
  setPage: (p: number) => void;
  refetch: () => Promise<void>;
};

export type UseEventsParams = {
  initialPage?: number;
  pageSize?: number;
  status?: StatusEvent[];
};

export type getAllEventsResponse = {
  events: Event[];
  total: number;
  page: number;
  pageCount: number;
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

export type UpdateEventInput = {
  name?: string;
  startDate?: string;
  endDate?: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  maxParticipants?: number;
  ticketPrice?: number;
  address?: string;
  status?: string;
  active?: boolean;
  responsibles?: string[];
};

export type FindDetailsEventRequest = {
  eventId: string;
};

export type TypeInscription = {
  description: string;
  value: number;
};

export type EventManager = {
  id: string;
  name: string;
  startDate: string | Date;
  endDate: string | Date;
  imageUrl?: string;
  location?: string;
  longitude?: number | null;
  latitude?: number | null;
  status: StatusEvent;
  paymentEnabled: boolean;
  regionName?: string;
  typeInscriptions: TypeInscription[];
};

export type FindDetailsEventResponse = {
  id: string;
  name: string;
  startDate: string | Date;
  endDate: string | Date;
  imageUrl?: string;
  location?: string;
  longitude?: number | null;
  latitude?: number | null;
  status: StatusEvent;
  paymentEnabled: boolean;
  regionName?: string;
  typeInscriptions: TypeInscription[];
};

export type InscriptionSummary = {
  id: string;
  name: string;
  createAt: string | Date;
  countParticipants: number;
};

export type AccountWithInscriptions = {
  id: string;
  username: string;
  countInscriptons: number;
  inscriptions: InscriptionSummary[];
};

export type FindAccountWithInscriptionsResponse = {
  accounts: AccountWithInscriptions[];
};
