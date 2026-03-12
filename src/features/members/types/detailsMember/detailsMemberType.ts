export type ShirtSize = "PP" | "P" | "M" | "G" | "GG" | "XG";

export type ShirtType = "TRADICIONAL" | "BABYLOOK";
export type genderType = "MASCULINO" | "FEMININO";

export type Member = {
  id: string;
  name: string;
  preferredName?: string;
  cpf?: string;
  birthDate: Date;
  gender: genderType;
  shirtSize?: ShirtSize;
  shirtType?: ShirtType;
  createdAt: string;
};

export type useDetailsMemberParams = {
  memberId: string;
};

export type getDetailsMemberResponse = {
  id: string;
  name: string;
  preferredName?: string;
  cpf?: string;
  birthDate: Date;
  gender: genderType;
  shirtSize?: ShirtSize;
  shirtType?: ShirtType;
  createdAt: string;
};

export type useDetailsMemberResult = {
  member: Member | null;
  loading: boolean;
  fetching: boolean;
  fetched: boolean;
  error: Error | null;
  refresh: () => void;
};
