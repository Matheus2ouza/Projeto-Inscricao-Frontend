export type CreateTypeInscriptionInput = {
  description: string;
  value: number;
  rule: number | null;
  eventId: string;
  specialType: boolean;
  participantLimit: number;
  limitIsStrict: boolean;
};

export type CreateTypeInscriptionResponse = {
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
