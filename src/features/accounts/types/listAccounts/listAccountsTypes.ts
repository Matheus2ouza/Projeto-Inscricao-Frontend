export enum RoleType {
  USER = 'USER',
  MANAGER = 'MANAGER',
  ADMIN = 'ADMIN',
  SUPER = 'SUPER',
}

export type Account = {
  id: string;
  username: string;
  role: RoleType;
  createdAt: Date;
  updatedAt: Date;
  regionName?: string;
};

export type ListAccountsResponse = {
  users: Account[];
  total: number;
  page: number;
  pageCount: number;
};

export type UseListAccountsParam = {
  initialPage: number;
  pageSize: number;
};

export type UseListAccountsResult = {
  accounts: Account[];
  total: number;
  page: number;
  pageCount: number;
  loading: boolean;
  error: Error | null;
  setPage: (p: number) => void;
  refetch: () => Promise<void>;
};
