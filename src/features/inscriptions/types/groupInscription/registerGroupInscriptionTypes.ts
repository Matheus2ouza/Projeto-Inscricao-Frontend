export interface GroupInscriptionFormData {
  responsible: string;
  email?: string;
  phone: string;
}

export interface GroupInscriptionConfirmationData {
  inscriptionId: string;
  paymentEnabled: boolean;
}

export interface MemberFormData {
  accountParticipantId: string;
  typeInscriptionId: string;
}

export interface MemberDisplayData extends MemberFormData {
  name: string;
  birthDate?: Date;
  gender?: string;
  typeInscriptionName?: string;
}

export interface GroupInscriptionSubmit {
  eventId: string;
  localityId: string;
  responsible: string;
  email?: string;
  phone: string;
  members: MemberSubmit[];
}

export interface MemberSubmit {
  accountParticipantId: string;
  typeInscriptionId: string;
}

export interface GroupInscriptionResponse {
  id: string;
}

export type IncompleteMember = {
  accountParticipantId: string;
  missingFields: string[];
};

export type GroupInscriptionActionResult =
  | { success: true; data: GroupInscriptionResponse }
  | {
      success: false;
      message: string;
      incompleteMembers?: IncompleteMember[];
    };
