export const genderOptions = [
  { value: 'MASCULINO', label: 'Masculino' },
  { value: 'FEMININO', label: 'Feminino' },
];
export const shirtSizeOptions = [
  { value: 'PP', label: 'PP' },
  { value: 'P', label: 'P' },
  { value: 'M', label: 'M' },
  { value: 'G', label: 'G' },
  { value: 'GG', label: 'GG' },
];

export enum InscriptionStatus {
  PENDING = 'PENDING',
  UNDER_REVIEW = 'UNDER_REVIEW',
  PAID = 'PAID',
  CANCELLED = 'CANCELLED',
}

export type GenderType = 'MASCULINO' | 'FEMININO' | string;

export type ShirtSizeType = 'PP' | 'P' | 'M' | 'G' | 'GG' | 'XG' | string;

export type ShirtType = 'TRADICIONAL' | 'BABYLOOK' | string;

export type RegisterGuestInscriptionInput = {
  // Dados do inscrito guest sempre obrigatórios
  name: string;
  email: string;
  phone: string;
  birthDate: string;
  gender: GenderType;

  // id da inscrição
  typeInscriptionId: string;
};

export type RegisterGuestInscriptionResponse = {
  id: string;
  status: InscriptionStatus;
  confirmationCode: string;
  expiresAt: string;
};
