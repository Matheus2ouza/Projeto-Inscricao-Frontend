export type AccountRole = 'USER' | 'MANAGER' | 'ADMIN' | 'SUPER';

export type Account = {
  id: string;
  username: string;
  role: string;
};

export type ListAccountsResponse = Account[];
