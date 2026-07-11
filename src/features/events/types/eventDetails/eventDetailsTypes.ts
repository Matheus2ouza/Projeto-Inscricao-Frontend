export type StatusEvent = 'OPEN' | 'CLOSE' | 'FINALIZED';

export type TypeInscription = {
  description: string;
  value: number;
};

export type FindEventDetailsResponse = {
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

export type Event = {
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

export interface UseEventDetailsParams {
  eventId?: string;
}

export interface UseEventDetailsResult {
  event: Event | null;
  loading: boolean;
  fetching: boolean;
  fetched: boolean;
  error: Error | null;
  refresh: () => void;
}
