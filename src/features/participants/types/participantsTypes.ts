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

export type Participants = {
  id: string;
  name: string;
  birthDate: string;
  gender: string;
}[];

export type Accounts = {
  id: string;
  username: string;
  countParticipants: number;
  participants: Participants;
}[];

export type ListParticipantsRequest = {
  page: number;
  pageSize: number;
};

export type ListParticipantsResponse = {
  account: Accounts;
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
  accounts: Accounts;
  total: number;
  page: number;
  pageCount: number;
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
