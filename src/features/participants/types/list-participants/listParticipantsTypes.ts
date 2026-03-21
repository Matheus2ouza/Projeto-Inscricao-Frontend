export type GetListParticipantsResponse = {
  participants: Participant[];
  countParticipants: number;
  countParticipantsMale: number;
  countParticipantsFemale: number;
  total: number;
  page: number;
  pageCount: number;
};

export type ShirtSizeType = "PP" | "P" | "M" | "G" | "GG" | "XG";
export type ShirtType = "TRADICIONAL" | "BABYLOOK";

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

export type UseListParticipantsParams = {
  eventId: string;
  initialPage: number;
  pageSize: number;
};

export type UseListParticipantsResult = {
  participants: Participant[];
  countParticipants: number;
  countParticipantsMale: number;
  countParticipantsFemale: number;
  total: number;
  page: number;
  pageCount: number;
  loading: boolean;
  error: string | null;
  setPage: (p: number) => void;
  refetch: () => Promise<void>;
};
