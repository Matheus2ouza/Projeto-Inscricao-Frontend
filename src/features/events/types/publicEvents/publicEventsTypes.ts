export enum InscriptionMode {
  NORMAL = 'NORMAL',
  GUEST = 'GUEST',
}

export enum EventStatus {
  OPEN = 'OPEN',
  CLOSE = 'CLOSE',
  FINALIZED = 'FINALIZED',
}

export type Event = {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  image?: string;
  url?: string;
  location?: string;
  longitude?: number | null;
  latitude?: number | null;
  status: EventStatus;
  allowedInscriptionModes: InscriptionMode[];
  createdAt: Date | string;
  regionName: string;
};

export type UsePublicEventParams = {
  slug: string;
};

export type UsePublicEventResult = {
  event: Event | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
};

export type UsePublicEventsResult = {
  events: Event[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
};
