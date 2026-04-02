export type GenderType = "MASCULINO" | "FEMININO";
export type ShirtSizeType = "PP" | "P" | "M" | "G" | "GG" | "XG";
export type ShirtType = "TRADICIONAL" | "BABYLOOK";

export type UpdateParticipantParams = {
  id: string;
  name?: string;
  cpf?: string;
  birthDate?: Date;
  gender?: GenderType;
  preferredName?: string;
  shirtSize?: ShirtSizeType;
  shirtType?: ShirtType;
};

export type UpdateParticipantInput = UpdateParticipantParams;

export type UpdateParticipantResponse = {
  id: string;
};
