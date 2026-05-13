export type CreateExclusiveInscriptionLinkInput = {
  eventId: string;
  typeInscriptionIds: string[];
  name: string;
  expiresAt: Date;
};

export type CreateExclusiveInscriptionLinkResponse = {
  id: string;
};

export type CreateExclusiveInscriptionLinkRequest =
  CreateExclusiveInscriptionLinkInput;
