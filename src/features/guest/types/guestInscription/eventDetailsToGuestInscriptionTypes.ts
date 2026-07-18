export type ParticipantFieldRule = 'required' | 'optional' | 'hidden';

export type ParticipantFieldsConfig = Record<
  'cpf' | 'preferredName' | 'shirtSize' | 'shirtType',
  ParticipantFieldRule
>;

export type Event = {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  image?: string;
  status: string;
  paymentEnabled: boolean;
  participanteConfig: ParticipantFieldsConfig;
};

export type TypeInscription = {
  id: string;
  description: string;
  rule: string | null;
  value: number;
  specialType: boolean;
  active: boolean;
  participantLimit: number;
  limitIsStrict: boolean;
  createdAt: Date;
};

export type EventDetailsToGuestInscriptionResponse = Event;

export type UseEventDetailsToGuestInscriptionParams = {
  eventId?: string;
};

export type UseEventDetailsToGuestInscriptionResult = {
  event: Event | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
};

export enum InscriptionStatus {
  PENDING = 'PENDING',
  UNDER_REVIEW = 'UNDER_REVIEW',
  PAID = 'PAID',
  CANCELLED = 'CANCELLED',
}
