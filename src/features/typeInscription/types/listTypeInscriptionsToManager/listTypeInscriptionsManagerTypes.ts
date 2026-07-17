export type TypeInscription = {
  id: string;
  description: string;
  rule: Date | null;
  value: number;
  specialType: boolean;
  active: boolean;
  participantLimit: number;
  limitIsStrict: boolean;
  createdAt: Date | string;
};

export type ListTypeInscriptionsToManagerResponse = TypeInscription[];

export type UseListTypeInscriptionsToManagerParams = {
  eventId?: string;
};

export type UseListTypeInscriptionsToManagerResult = {
  typeInscriptions: TypeInscription[];
  loading: boolean;
  fetching: boolean;
  fetched: boolean;
  error: Error | null;
  refresh: () => void;
};
