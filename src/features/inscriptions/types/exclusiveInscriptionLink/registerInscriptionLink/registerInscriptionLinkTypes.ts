export enum InscriptionStatus {
  PENDING = 'PENDING',
  UNDER_REVIEW = 'UNDER_REVIEW',
  PAID = 'PAID',
  CANCELLED = 'CANCELLED',
}

export type GenderType = 'MASCULINO' | 'FEMININO' | string;

export type RegisterInscriptionLinkInput = {
  eventId: string;
  exclusiveInscriptionLink: string;

  // Dados do inscrito guest
  email: string;
  name: string;
  preferredName?: string;
  cpf: string;
  gender: GenderType;
  phone: string;
  locality: string;
  birthDate: Date | string;

  // dados complementares
  observation?: string;

  // id da inscrição
  typeInscriptionId: string;
};

export type RegisterInscriptionLinkResponse = {
  id: string;
  status: InscriptionStatus;
  confirmationCode: string;
};
