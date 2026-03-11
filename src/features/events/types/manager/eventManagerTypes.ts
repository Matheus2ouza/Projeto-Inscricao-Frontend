export enum InscriptionMode {
  NORMAL = "NORMAL",
  GUEST = "GUEST",
}

export enum EventStatus {
  OPEN = "OPEN",
  CLOSE = "CLOSE",
  FINALIZED = "FINALIZED",
}

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

export type TypeInscriptions = {
  id: string;
  description: string;
  rule: Date | null;
  value: number;
  specialType: boolean;
  createdAt: Date;
};

export type Responsible = {
  id: string;
  name: string;
};

export type getEventResponse = {
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

export enum StatusEvent {
  OPEN = "ABERTO",
  CLOSE = "FECHADO",
  FINALIZED = "FINALIZADO",
}

export type UseEventManagerParams = {
  eventId: string;
};

export type UseEventManagerResult = {
  event: Event | null;
  loadingEvent: boolean;
  fetchingEvent: boolean;
  fetchedEvent: boolean;
  errorEvent: Error | null;
  refetchEvent: () => Promise<void>;
  typeInscriptions: TypeInscriptions[] | null;
  loadingTypeInscriptions: boolean;
  fetchingTypeInscriptions: boolean;
  fetchedTypeInscriptions: boolean;
  errorTypeInscriptions: Error | null;
  refetchTypeInscriptions: () => Promise<void>;
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
  status?: EventStatus;
  allowedInscriptionModes?: InscriptionMode[];
  active?: boolean;
  responsibles?: string[];
};

//types para os tipos de inscrição
export type getTypeInscriptionsByEventResponse = {
  id: string;
  description: string;
  rule: Date;
  value: number;
  specialType: boolean;
  createdAt: Date;
}[];
