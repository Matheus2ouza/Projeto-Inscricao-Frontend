export type Events = {
  id: string;
  name: string;
  imageUrl?: string;
  countInscriptions: number;
  countParticipants: number;
}[];

export type FindAllToParticipantsResponse = {
  events: Events;
  total: number;
  page: number;
  pageCount: number;
};

export type UseEventsParams = {
  initialPage?: number;
  pageSize?: number;
};

export type UseEventsResult = {
  events: Events;
  total: number;
  page: number;
  pageCount: number;
  loading: boolean;
  error: string | null;
  setPage: (p: number) => void;
  refetch: () => Promise<void>;
};

export type Participant = {
  id: string;
  name: string;
  birthDate: string;
  typeInscription: string;
  gender: string;
};

export type Account = {
  id: string;
  username: string;
  countParticipants: number;
  participants: Participant[];
};

export type ListParticipantsRequest = {
  page: number;
  pageSize: number;
};

export type ListParticipantsResponse = {
  accounts: Account[];
  countAccounts: number;
  countParticipants: number;
  countParticipantsMale: number;
  countParticipantsFemale: number;
  total: number;
  page: number;
  pageCount: number;
};

export type UseParticipantsParams = {
  eventId: string;
  initialPage?: number;
  pageSize?: number;
};

export type UseParticipantsResult = {
  accounts: Account[];
  total: number;
  page: number;
  pageCount: number;
  countAccounts: number;
  countParticipants: number;
  countParticipantsMale: number;
  countParticipantsFemale: number;
  loading: boolean;
  error: string | null;
  setPage: (p: number) => void;
  refetch: () => Promise<void>;
};

export type UpdateParticipantInput = {
  name: string;
  birthDate: string;
  gender: string;
  typeInscriptionId?: string;
};
