export type TypeInscription = {
  id: string;
  description: string;
  value: number;
};

export type ListTypeInscriptionsResponse = TypeInscription[];

export type UseListTypeInscriptionsParams = {
  eventId: string;
};

export type UseListTypeInscriptionsResult = {
  typeInscriptions: TypeInscription[];
  loading: boolean;
  fetching: boolean;
  fetched: boolean;
  error: Error | null;
  refresh: () => void;
};
