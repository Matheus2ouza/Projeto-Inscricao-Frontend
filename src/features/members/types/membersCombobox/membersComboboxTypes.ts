import { UF } from '@/features/locality/types/listLocalities/listLocalitiesTypes';

export type ShirtSize = 'PP' | 'P' | 'M' | 'G' | 'GG' | 'XG';

export type ShirtType = 'TRADICIONAL' | 'BABYLOOK';

type Locality = {
  id: string;
  name: string;
  uf: UF;
};

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
  locality?: Locality;
};

export type membersComboboxResponse = Member[];

export type useMembersComboboxParms = {
  eventId?: string;
  localityId?: string;
  autoFetch: boolean;
};

export type useMembersComboboxResult = {
  members: Member[];
  loading: boolean;
  fetching: boolean;
  error: string | null;
  refetch: () => Promise<void>;
};
