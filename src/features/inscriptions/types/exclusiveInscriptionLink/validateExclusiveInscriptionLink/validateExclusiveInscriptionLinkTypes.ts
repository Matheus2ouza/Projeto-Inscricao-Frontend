export type PreviewExclusiveInscriptionLinkResponse = {
  event: Event;
  exclusiveInscriptionLink: ExclusiveInscriptionLink;
  status: 'valid' | 'inactive' | 'expired';
  canInscribe: boolean;
};

export type Event = {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  location?: string;
  image: string;
};

export type ExclusiveInscriptionLink = {
  token: string;
  active: boolean;
  expiresAt: Date;
  countInscriptions: number;
  typeInscriptions: TypeInscriptionAllowed[];
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

export type useValidateExclusiveInscriptionLinkResult = {
  event: Event | null;
  exclusiveInscriptionLink?: ExclusiveInscriptionLink;
  status: 'valid' | 'inactive' | 'expired';
  canInscribe: boolean;
  loading: boolean;
  fetching: boolean;
  fetched: boolean;
  error: Error | null;
  refresh: () => void;
};
