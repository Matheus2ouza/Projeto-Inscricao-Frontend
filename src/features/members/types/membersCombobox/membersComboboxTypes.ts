export type ShirtSize = 'PP' | 'P' | 'M' | 'G' | 'GG' | 'XG';

export type ShirtType = 'TRADICIONAL' | 'BABYLOOK';

export type Member = {
  id: string;
  name: string;
  cpf?: string;
  preferredName?: string;
  birthDate: Date;
  gender: string;
  shirtSize?: ShirtSize;
  shirtType?: ShirtType;
  registered: boolean;
};

export type MembersResponse = Member[];

export type useMembersParms = {
  eventId: string;
  accountId?: string;
  autoFetch: boolean;
};

export type useMembersResult = {
  members: Member[];
  loading: boolean;
  fetching: boolean;
  error: string | null;
  refetch: () => Promise<void>;
};
