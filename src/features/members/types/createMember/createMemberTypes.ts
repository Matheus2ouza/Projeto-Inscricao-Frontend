export enum GenderType {
  MASCULINO = 'MASCULINO',
  FEMININO = 'FEMININO',
}

export type CreateMemberInput = {
  localityId: string;
  name: string;
  cpf: string;
  birthDate: string;
  gender: GenderType;
};

export type CreateMemberResponse = {
  id: string;
};
