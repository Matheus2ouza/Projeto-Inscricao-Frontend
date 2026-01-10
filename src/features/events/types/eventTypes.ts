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
  latitude?: number | null;
  longitude?: number | null;
  status: string;
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
  maxParticipants?: number;
  ticketPrice?: number;
  latitude?: number;
  longitude?: number;
  address?: string;
  status?: string;
  responsibles?: string[]; // IDs dos responsáveis adicionados durante a edição
};

export type FindDetailsEventRequest = {
  eventId: string;
};

export type TypeInscription = {
  description: string;
  value: number;
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
