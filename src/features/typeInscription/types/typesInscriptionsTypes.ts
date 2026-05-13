export type TypeInscription = {
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

export type CreateTypeInscriptionInput = {
  description: string;
  value: number;
  eventId: string;
  specialType: boolean;
  rule: Date | null;
};

export type UpdateTypeInscriptionInput = {
  description?: string;
  value?: number;
  specialType?: boolean;
  rule?: Date | null;
};

export type getTypeInscriptionsByEventResponse = TypeInscription[];

export type useTypeInscriptionParams = {
  eventId: string;
};

export type useTypeInscriptionResult = {
  typeInscriptions: TypeInscription[];
  loading: boolean;
  fetching: boolean;
  fetched: boolean;
  error: Error | null;
  refresh: () => void;
};
