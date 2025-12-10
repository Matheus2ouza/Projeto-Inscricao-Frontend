export type PaymentMethod = "DINHEIRO" | "PIX" | "CARTAO";
export type InscriptionStatus =
  | "PENDING"
  | "PAID"
  | "CANCELLED"
  | "UNDER_REVIEW";
export type GenderType = "MASCULINO" | "FEMININO";

export type AvulsaRegistration = {
  id: string;
  responsible: string;
  phone?: string;
  totalValue: number;
  status: string;
  createdAt: string;
  updatedAt: string;
};

export type OnSiteRegistrationPaymentTotals = {
  totalDinheiro: number;
  totalCartao: number;
  totalPix: number;
  totalGeral: number;
};

export type ListAvulsaRequest = {
  eventId: string;
  page?: string;
  pageSize?: string;
};

export type ListAvulsaResponse = {
  registrations: AvulsaRegistration[];
  total: number;
  page: number;
  pageCount: number;
  totals: OnSiteRegistrationPaymentTotals;
};

export type GetAvulsaRegistrationDetailsRequest = {
  eventId: string;
  registrationId: string;
};

export type OnSiteParticipantPayment = {
  id: string;
  paymentMethod: PaymentMethod;
  value: number;
};

export type OnSiteParticipant = {
  id: string;
  name: string;
  gender: string;
  onSiteParticipantPayment: OnSiteParticipantPayment[];
};

export type AvulsaRegistrationDetails = {
  id: string;
  name: string;
  createdAt: string;
  onSiteParticipant: OnSiteParticipant[];
};

export type Decimal = string;

export type ParticipantPayment = {
  paymentMethod: PaymentMethod;
  value: Decimal;
};

export type CreateInscriptionAvulParticipant = {
  name: string;
  gender: GenderType;
  payments: ParticipantPayment[];
};

export type CreateInscriptionAvulInput = {
  eventId: string;
  responsible: string;
  phone?: string;
  totalValue: number;
  status: InscriptionStatus;
  participants: CreateInscriptionAvulParticipant[];
};

export const avulsaKeys = {
  all: ["avulsa"] as const,
  list: (eventId: string, page: number, pageSize: number) =>
    [...avulsaKeys.all, "list", eventId, { page, pageSize }] as const,
  detail: (eventId: string, registrationId: string) =>
    [...avulsaKeys.all, "detail", eventId, registrationId] as const,
};
