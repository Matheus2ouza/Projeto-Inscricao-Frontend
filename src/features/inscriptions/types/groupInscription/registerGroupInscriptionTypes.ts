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
  responsible: string;
  email?: string;
  phone: string;
  members: MemberSubmit[];
}

export interface MemberSubmit {
  accountParticipantId: string;
  typeInscriptionId: string;
}

export interface RespondeErrorData {
  statusCode: number;
  timeStamp: string;
  message: string;
}

export interface GroupInscriptionResponse {
  inscriptionId: string;
  paymentEnabled: boolean;
}
