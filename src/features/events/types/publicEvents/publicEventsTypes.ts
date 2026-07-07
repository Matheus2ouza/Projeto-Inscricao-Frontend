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
  image: string;
  regionName: string;
  location: string;
  latitude: number;
  longitude: number;
  status: EventStatus;
  allowedInscriptionModes: InscriptionMode[];
  createdAt: string;
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
