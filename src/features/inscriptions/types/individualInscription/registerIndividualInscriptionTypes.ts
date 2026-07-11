export type IndividualInscriptionInput = {
  eventId: string;
  responsible: string;
  email?: string;
  phone: string;
  member: {
    accountParticipantId: string;
    typeInscriptionId: string;
  };
};

export interface IndividualInscriptionResponse {
  id: string;
}
