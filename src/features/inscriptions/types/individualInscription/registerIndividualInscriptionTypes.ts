export interface Member {
  accountParticipantId: string;
  typeInscriptionId: string;
}

export type IndividualInscriptionInput = {
  eventId: string;
  localityId: string;
  responsible: string;
  email?: string;
  phone: string;
  member: Member;
};

export interface IndividualInscriptionResponse {
  id: string;
}

export type IncompleteMember = {
  accountParticipantId: string;
  missingFields: string[];
};

export type IndividualInscriptionActionResult =
  | { success: true; data: IndividualInscriptionResponse }
  | {
      success: false;
      message: string;
      incompleteMembers?: IncompleteMember[];
    };
