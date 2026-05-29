export type ListNamesParticipants = {
  id: string;
  name: string;
};

export type GetListNamesParticipantsResponse = ListNamesParticipants[];

export type UseListNamesParticipantsParams = {
  eventId?: string;
};

export type UseListNamesParticipantsResult = {
  participants: ListNamesParticipants[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
};
