export type UpdateTypeInscriptionInput = {
  description?: string;
  value?: number;
  specialType?: boolean;
  ruleDate?: number | null;
  participantLimit?: number;
  limitIsStrict?: boolean;
};

export type UpdateTypeInscriptionResponse = {
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
