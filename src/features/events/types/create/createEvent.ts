export enum InscriptionMode {
  NORMAL = 'NORMAL',
  GUEST = 'GUEST',
}

export enum EventStatus {
  OPEN = 'OPEN',
  CLOSE = 'CLOSE',
  FINALIZED = 'FINALIZED',
}

export type CreateEventResponsible = {
  accountId: string;
};

export type CreateEventRequest = {
  name: string;
  startDate: Date;
  endDate: Date;
  regionId: string;
  image?: string;
  location?: string;
  status: EventStatus;
  allowedInscriptionModes: InscriptionMode[];
  paymentEnabled: boolean;
  responsibles?: CreateEventResponsible[];
};

export type RegisterEventResponse = {
  id: string;
};
