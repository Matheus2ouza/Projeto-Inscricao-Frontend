export type AccountRole = 'USER' | 'MANAGER' | 'ADMIN' | 'SUPER';

export type Account = {
  id: string;
  username: string;
  role: AccountRole;
};

export type ResponsiblesDialogResponse = Account[];

export type UseResponsiblesDialogResult = {
  accounts: Account[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
};
