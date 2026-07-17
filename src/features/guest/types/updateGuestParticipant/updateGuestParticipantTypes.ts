export type ParticipantFieldRule = 'required' | 'optional' | 'hidden';

export type ParticipantFieldsConfig = Record<
  'cpf' | 'preferredName' | 'shirtSize' | 'shirtType',
  ParticipantFieldRule
>;

export enum GenderType {
  MASCULINO = 'MASCULINO',
  FEMININO = 'FEMININO',
}

export enum ShirtSize {
  PP = 'PP',
  P = 'P',
  M = 'M',
  G = 'G',
  GG = 'GG',
  XG = 'XG',
}

export enum ShirtType {
  TRADICIONAL = 'TRADICIONAL',
  BABYLOOK = 'BABYLOOK',
}

export type UpdateGuestParticipantInput = {
  name?: string;
  cpf?: string;
  birthDate?: string;
  gender?: GenderType;
  preferredName?: string;
  shirtSize?: ShirtSize;
  shirtType?: ShirtType;
};

export type UpdateGuestParticipantResponse = {
  id: string;
};
