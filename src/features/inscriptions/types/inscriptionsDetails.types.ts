export interface Payment {
  id: string;
  status: string;
  value: number;
  image: string;
  rejectionReason: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Participant {
  id: string;
  typeInscription: string | undefined;
  typeInscriptionId?: string;
  name: string;
  birthDate: Date | string;
  gender: string;
}

export interface InscriptionDetails {
  id: string;
  accountId: string;
  eventId: string;
  responsible: string;
  email: string;
  phone: string;
  totalValue: number;
  status: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  payments?: Payment[];
  participants: Participant[];
  countParticipants: number;
}

export interface DetailsInscriptionsTableProps {
  inscriptionId: string;
}

export type GetInscriptionsDetails = {
  id: string;
  accountId: string;
  eventId: string;
  responsible: string;
  email: string;
  phone: string;
  totalValue: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  payments?: Payment[];
  participants: Participant[];
  countParticipants: number;
};
