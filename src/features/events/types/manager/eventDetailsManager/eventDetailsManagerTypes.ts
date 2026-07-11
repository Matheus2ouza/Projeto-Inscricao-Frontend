export enum InscriptionMode {
  NORMAL = 'NORMAL',
  GUEST = 'GUEST',
}

export enum EventStatus {
  OPEN = 'OPEN',
  CLOSE = 'CLOSE',
  FINALIZED = 'FINALIZED',
}

export type Responsible = {
  id: string;
  name: string;
};

export type TypeInscriptions = {
  id: string;
  description: string;
  rule: Date | null;
  value: number;
  specialType: boolean;
  active: boolean;
  participantLimit: number;
  limitIsStrict: boolean;
  createdAt: Date;
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
  status: EventStatus;
  allowedInscriptionModes: InscriptionMode[];
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

export type EventDetailsManagerResponse = Event;

export type UseEventDetailsManagerParams = {
  eventId?: string;
};

export type UseEventDetailsManagerResult = {
  event: Event | null;
  loading: boolean;
  fetching: boolean;
  fetched: boolean;
  error: Error | null;
  refresh: () => void;
};
