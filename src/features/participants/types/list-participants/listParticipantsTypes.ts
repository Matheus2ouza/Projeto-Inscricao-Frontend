export enum InscriptionsStatus {
  PENDING = 'PENDING',
  UNDER_REVIEW = 'UNDER_REVIEW',
  PAID = 'PAID',
  EXPIRED = 'EXPIRED',
  CANCELLED = 'CANCELLED',
}

export type ShirtSizeType = 'PP' | 'P' | 'M' | 'G' | 'GG' | 'XG';
export type ShirtType = 'TRADICIONAL' | 'BABYLOOK';

export type Participant = {
  id: string;
  name: string;
  preferredName: string;
  birthDate: Date;
  typeInscription: string;
  gender: string;
  shirtSize: ShirtSizeType;
  shirtType: ShirtType;
  guest: boolean;
};

export type TypeInscription = {
  id: string;
  description: string;
};

export type GetListParticipantsResponse = {
  participants: Participant[];
  countParticipants: number;
  countParticipantsMale: number;
  countParticipantsFemale: number;
  typesInscriptionsInUse: TypeInscription[];
  total: number;
  page: number;
  pageCount: number;
};

export type UseListParticipantsParams = {
  eventId: string;
  initialPage: number;
  pageSize: number;

  inscriptionStatus?: InscriptionsStatus[];
  typeInscriptions?: string[];
  orderByName?: 'asc' | 'desc';
};

export type UseListParticipantsResult = {
  participants: Participant[];
  countParticipants: number;
  countParticipantsMale: number;
  countParticipantsFemale: number;
  typesInscriptionsInUse: TypeInscription[];
  total: number;
  page: number;
  pageCount: number;
  loading: boolean;
  error: string | null;
  setPage: (p: number) => void;
  refresh: () => Promise<void>;
};
