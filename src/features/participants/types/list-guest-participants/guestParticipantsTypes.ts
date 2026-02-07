export type GuestParticipantsResponse = {
  guestParticipants: GuestParticipant[];
  countGuestParticipants: number;
  countGuestParticipantsMale: number;
  countGuestParticipantsFemale: number;
  total: number;
  page: number;
  pageCount: number;
};

export type GuestParticipant = {
  id: string;
  name: string;
  preferredName: string;
  birthDate: Date;
  typeInscription: string;
  gender: string;
  shirtSize: string;
  shirtType: string;
};

export type UseListGuestParticipantsParams = {
  eventId: string;
  initialPage: number;
  pageSize: number;
};

export type UseListGuestParticipantsResult = {
  guestParticipants: GuestParticipant[];
  countGuestParticipants: number;
  countGuestParticipantsMale: number;
  countGuestParticipantsFemale: number;
  total: number;
  page: number;
  pageCount: number;
  loading: boolean;
  error: string | null;
  setPage: (p: number) => void;
  refetch: () => Promise<void>;
};
