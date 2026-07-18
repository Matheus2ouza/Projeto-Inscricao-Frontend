export interface TypeInscription {
  id: string;
  description: string;
  value: number;
}

export interface GroupInscriptionConfirmationData {
  inscriptionId: string;
}

// Novo tipo para estado dos membros
export interface MemberFormData {
  accountParticipantId: string;
  typeInscriptionId: string;
}

// Tipo estendido para exibição na lista
export interface MemberDisplayData extends MemberFormData {
  name: string;
  birthDate?: Date;
  gender?: string;
  typeInscriptionName?: string; // Para mostrar o nome do tipo de inscrição
}

// Tipo para submissão de inscrição em grupo
export type GroupInscriptionSubmit = {
  eventId: string;
  responsible: string;
  email?: string;
  phone: string;
  members: member[];
};

export type member = {
  accountParticipantId: string;
  typeInscriptionId: string;
};
