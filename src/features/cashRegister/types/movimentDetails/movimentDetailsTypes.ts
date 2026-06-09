export enum CashRegisterStatus {
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
}

export enum CashEntryType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
  WITHDRAWAL = 'WITHDRAWAL',
}

export enum PaymentMethod {
  DINHEIRO = 'DINHEIRO',
  PIX = 'PIX',
  CARTAO = 'CARTAO',
}

export enum CashEntryOrigin {
  ASAAS = 'ASAAS',
  INTERNAL = 'INTERNAL',
  ONSITE = 'ONSITE',
  EXPENSE = 'EXPENSE',
  TICKET = 'TICKET',
  TRANSFER = 'TRANSFER',
  MANUAL = 'MANUAL',
}

export type GenderType = 'MASCULINO' | 'FEMININO';

export type InscriptionStatus =
  | 'PENDING'
  | 'UNDER_REVIEW'
  | 'PAID'
  | 'EXPIRED'
  | 'CANCELLED';

export type TicketSaleStatus =
  | 'PENDING'
  | 'UNDER_REVIEW'
  | 'PAID'
  | 'CANCELLED';

export type ReferenceParticipant = {
  name: string;
  preferredName?: string;
  birthDate: Date;
  gender: GenderType;
};

export type InscriptionReference = {
  kind: 'INSCRIPTION';
  paymentInstallmentId: string;
  inscription?: {
    id: string;
    eventId: string;
    status: InscriptionStatus;
    totalValue: number;
    totalPaid: number;
    isGuest: boolean;
    guestName?: string;
    guestEmail?: string;
    createdAt: Date;
    participants: ReferenceParticipant[];
  };
};

export type OnSiteRegistrationReference = {
  kind: 'ONSITE_REGISTRATION';
  onSiteRegistrationId: string;
  onSiteRegistration?: {
    id: string;
    eventId: string;
    status: InscriptionStatus;
    totalValue: number;
    responsible: string;
    createdAt: Date;
  };
};

export type EventExpenseReference = {
  kind: 'EVENT_EXPENSE';
  eventExpenseId: string;
  eventExpense?: {
    id: string;
    eventId: string;
    description: string;
    value: number;
    paymentMethod: PaymentMethod;
    responsible: string;
    createdAt: Date;
  };
};

export type TicketSaleReference = {
  kind: 'TICKET_SALE';
  ticketSaleId: string;
  ticketSale?: {
    id: string;
    eventId: string;
    status: TicketSaleStatus;
    name: string;
    email?: string;
    phone?: string;
    totalValue: number;
    createdAt: Date;
  };
};

export type UnknownReference = {
  kind: 'UNKNOWN';
  id: string;
};

export type Reference =
  | InscriptionReference
  | OnSiteRegistrationReference
  | EventExpenseReference
  | TicketSaleReference
  | UnknownReference;

export type MovimentDetails = {
  id: string;
  type: CashEntryType;
  origin: CashEntryOrigin;
  method: PaymentMethod;
  value: number;
  description?: string;
  eventId?: string;
  paymentInstallmentId?: string;
  onSiteRegistrationId?: string;
  eventExpenseId?: string;
  ticketSaleId?: string;
  responsible?: string;
  imageUrls: string[];
  createdAt: Date;
  reference: Reference;
};

export type MovimentDetailsBase = Omit<MovimentDetails, 'reference'>;

export type MovimentDetailsParams = {
  movimentId: string;
};

export type MovimentDetailsResult = {
  movimentDetails: MovimentDetailsBase | null;
  reference: Reference | null;
  referenceKind: Reference['kind'] | null;
  referenceId: string | null;
  loading: boolean;
  fetching: boolean;
  error: string | null;
  refetch: () => Promise<void>;
};

export type MovimentDetailsInput = {
  movimentId: string;
};

export type MovimentDetailsResponse = MovimentDetails;
