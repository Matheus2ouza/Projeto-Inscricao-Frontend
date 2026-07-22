export type ShirtSize = 'PP' | 'P' | 'M' | 'G' | 'GG' | 'XG';

export type ShirtType = 'TRADICIONAL' | 'BABYLOOK';
export type genderType = 'MASCULINO' | 'FEMININO';

export type Member = {
  id: string;
  name: string;
  cpf?: string;
  gender: genderType;
  locality?: string;
};

export type FindAllToMembersResponse = {
  members: Member[];
  total: number;
  page: number;
  pageCount: number;
};

export type UseMembersParams = {
  localityId?: string;
  initialPage?: number;
  pageSize?: number;
  autoFetch: boolean;
};

export type UseMembersResult = {
  members: Member[];
  total: number;
  page: number;
  pageCount: number;
  loading: boolean;
  error: Error | null;
  setPage: (page: number) => void;
  refresh: () => void;
};
