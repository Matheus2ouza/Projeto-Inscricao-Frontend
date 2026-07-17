export type TypeInscription = {
  id: string;
  description: string;
  rule: string | null;
  value: number;
  specialType: boolean;
  active: boolean;
  participantLimit: number;
  limitIsStrict: boolean;
  createdAt: Date;
};

export type ListTypeInscriptionsResponse = TypeInscription[];

export type UseListTypeInscriptionsParams = {
  eventId?: string;
};

export type UseListTypeInscriptionsResult = {
  typeInscriptions: TypeInscription[];
  loading: boolean;
  fetching: boolean;
  fetched: boolean;
  error: Error | null;
  refresh: () => void;
};
