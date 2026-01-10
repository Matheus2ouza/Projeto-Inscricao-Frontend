export type Member = {
  id: string;
  name: string;
  birthDate: string;
  gender: string;
  createdAt: string;
};

export type FindAllToMembersResponse = {
  members: Member[];
  total: number;
  page: number;
  pageCount: number;
};

export type UseMembersParams = {
  initialPage?: number;
  pageSize?: number;
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
