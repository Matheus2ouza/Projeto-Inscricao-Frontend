export type TypeInscriptions = {
  id: string;
  description: string;
  value: number;
  specialType: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateTypeInscriptionInput = {
  description: string;
  value: number;
  eventId: string;
  specialType: boolean;
};

export type UpdateTypeInscriptionInput = {
  description?: string;
  value?: number;
  specialType?: boolean;
};

export type getTypeInscriptionsByEventResponse = {
  id: string;
  description: string;
  value: number;
  specialType: boolean;
  createdAt: Date;
  updatedAt: Date;
}[];

export type useTypeInscriptionParams = {
  eventId: string;
};

export type useTypeInscriptionResult = {
  typeInscriptions: TypeInscriptions[];
  loading: boolean;
  fetching: boolean;
  fetched: boolean;
  error: Error | null;
  refresh: () => void;
};
