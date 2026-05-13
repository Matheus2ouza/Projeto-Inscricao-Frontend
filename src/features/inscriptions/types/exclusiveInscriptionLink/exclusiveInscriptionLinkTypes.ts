export type Event = {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  image: string;
  countExckusiveInscriptionLinks: number;
  countExckusiveInscriptionLinksEnabled: number;
  countExckusiveInscriptionLinksDisabled: number;
};

export type ExclusiveInscriptionLink = {
  id: string;
  name: string;
  token: string;
  expiresAt: Date;
  active: boolean;
  countInscriptions: number;
  typeInscriptionAllowed: TypeInscriptionAllowed[];
};

export type TypeInscriptionAllowed = {
  id: string;
  description: string;
  value: number;
  specialType: boolean;
  rule?: Date;
  active: boolean;
  participantLimit: number;
  limitIsStrict: boolean;
  currentCount: number;
};

export type ListExclusiveInscriptionLinksInput = {
  eventId?: string;
  page: number;
  pageSize: number;
};

export type ListExclusiveInscriptionLinksResponse = {
  event: Event;
  exclusiveInscriptionLinks: ExclusiveInscriptionLink[];
  total: number;
  page: number;
  pageCount: number;
};

export type ListExclusiveInscriptionLinksParams = {
  eventId?: string;
  initialPage: number;
  pageSize: number;
};

export type ListExclusiveInscriptionLinksResult = {
  event: Event | null;
  exclusiveInscriptionLinks: ExclusiveInscriptionLink[];
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
