export type InscriptionStatus =
  | "PENDING"
  | "UNDER_REVIEW"
  | "PAID"
  | "EXPIRED"
  | "CANCELLED";

export type StatusPayment = "APPROVED" | "UNDER_REVIEW" | "REFUSED";

export type PaymentMethod = "DINHEIRO" | "PIX" | "CARTAO";

export type genderType = "MASCULINO" | "FEMININO";

export type ShirtSize = "PP" | "P" | "M" | "G" | "GG" | "XG";

export type ShirtType = "TRADICIONAL" | "BABYLOOK";

export type createInscriptionAdminData = {
  eventId: string;

  // O admin pode setar o status da inscrição
  status: InscriptionStatus;

  // para ver se é inscrição Guest
  isGuest: boolean;

  // Dados Normais
  accountId?: string;
  responsible: string;
  email: string;
  phone: string;

  // Dados Guest
  guestLocality?: string;

  totalValue: number;
  totalPaid?: number;

  participants: ParticipantInscription[];
  // Pode já vir com o pagamento entao é opcional
  payment?: PaymentInscription;
};

export type ParticipantInscription = {
  // Se for normal envia somente os dados do membro
  accountParticipantId?: string;

  // Se for Guest envia os dados do Participante
  name?: string;
  preferredName?: string;
  shirtSize?: ShirtSize;
  shirtType?: ShirtType;
  birthDate?: string;
  cpf?: string;
  gender?: genderType;

  // Unico dado que é obrigatório em ambas as situações
  typeInscriptionId: string;
};

export type PaymentInscription = {
  // Se for pagamento Guest
  guestName?: string;
  guestEmail?: string;

  status: StatusPayment;
  methodPayment: PaymentMethod;

  totalValue?: number;
  totalPaid?: number;
  installment?: number;

  image?: string;
};

export type createInscriptionAdminResponse = {
  id: string;
};
