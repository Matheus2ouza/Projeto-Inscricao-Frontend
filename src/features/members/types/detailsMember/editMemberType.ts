export type ShirtSize = "PP" | "P" | "M" | "G" | "GG" | "XG";

export type ShirtType = "TRADICIONAL" | "BABYLOOK";
export type genderType = "MASCULINO" | "FEMININO";

export type EditMemberData = {
  name: string;
  preferredName?: string;
  cpf?: string;
  birthDate: Date;
  gender: genderType;
  shirtSize?: ShirtSize;
  shirtType?: ShirtType;
};

export type EditMemberResponse = {
  id: string;
};
