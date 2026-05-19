export type InscriptionStatus =
  | 'PENDING'
  | 'UNDER_REVIEW'
  | 'PAID'
  | 'EXPIRED'
  | 'CANCELLED';

export type StatusPayment = 'APPROVED' | 'UNDER_REVIEW' | 'REFUSED';

export type PaymentMethod = 'DINHEIRO' | 'PIX' | 'CARTAO';

export type genderType = 'MASCULINO' | 'FEMININO';

export type ShirtSize = 'PP' | 'P' | 'M' | 'G' | 'GG' | 'XG';

export type ShirtType = 'TRADICIONAL' | 'BABYLOOK';

export type createInscriptionAdminData = {
  eventId: string;

  // para ver se é inscrição Guest
  isGuest: boolean;

  // Dados Normais
  accountId?: string;
  responsible: string;
  email?: string;
  phone?: string;

  // Dados Guest
  locality?: string;

  participants: ParticipantInscription[];
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
