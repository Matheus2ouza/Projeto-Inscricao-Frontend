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
  typeInscriptionName?: string;
}
