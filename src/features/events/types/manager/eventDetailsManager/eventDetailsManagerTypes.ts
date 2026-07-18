export enum InscriptionMode {
  NORMAL = 'NORMAL',
  GUEST = 'GUEST',
}

export enum PaymentMode {
  CARTAO = 'CARTAO',
  PIX = 'PIX',
  BOLETO = 'BOLETO',
}

export enum EventStatus {
  OPEN = 'OPEN',
  CLOSE = 'CLOSE',
  FINALIZED = 'FINALIZED',
}

export type Responsible = {
  id: string;
  name: string;
};

export type TypeInscriptions = {
  id: string;
  description: string;
  rule: Date | null;
  value: number;
  specialType: boolean;
  active: boolean;
  participantLimit: number;
  limitIsStrict: boolean;
  createdAt: Date;
};

export type ParticipantFieldRule = 'required' | 'optional' | 'hidden';

export type ParticipantFieldsConfig = Record<
  'cpf' | 'preferredName' | 'shirtSize' | 'shirtType',
  ParticipantFieldRule
>;

export type Event = {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  quantityParticipants: number;
  amountCollected: number;
  image?: string;
  logo?: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  status: EventStatus;
  allowedInscriptionModes: InscriptionMode[];
  allowedPaymentModes: PaymentMode[];
  paymentEnebled: boolean;
  createdAt: string;
  regionName?: string;
  responsibles?: Responsible[];
  participanteConfig: ParticipantFieldsConfig;
};

export type EventDetailsManagerResponse = Event;

export type UseEventDetailsManagerParams = {
  eventId?: string;
};

export type UseEventDetailsManagerResult = {
  event: Event | null;
  loading: boolean;
  fetching: boolean;
  fetched: boolean;
  error: Error | null;
  refresh: () => void;
};
