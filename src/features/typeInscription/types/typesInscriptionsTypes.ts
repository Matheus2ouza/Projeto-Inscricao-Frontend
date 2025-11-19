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
