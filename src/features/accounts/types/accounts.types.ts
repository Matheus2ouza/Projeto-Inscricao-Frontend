export type AccountRole = 'USER' | 'MANAGER' | 'ADMIN' | 'SUPER';

export type AccountResponse = {
  id: string;
  username: string;
  role: string;
};
