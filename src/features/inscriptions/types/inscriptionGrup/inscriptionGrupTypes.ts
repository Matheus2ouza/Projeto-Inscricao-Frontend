import { FieldErrors } from "react-hook-form";

export interface GroupInscriptionFormData {
  responsible: string;
  email?: string;
  phone: string;
}

export interface GroupInscriptionConfirmationData {
  inscriptionId: string;
}

export interface UseFormInscriptionGrupProps {
  eventId: string;
}

// Novo tipo para estado dos membros
export interface MemberFormData {
  accountParticipantId: string;
  typeInscriptionId: string;
}

// Tipo estendido para exibição na lista
export interface MemberDisplayData extends MemberFormData {
  name: string;
  birthDate?: Date;
  gender?: string;
  typeInscriptionName?: string; // Para mostrar o nome do tipo de inscrição
}

export interface UseFormInscriptionGrupReturn {
  // Estado
  formData: GroupInscriptionFormData;
  members: MemberDisplayData[];
  isSubmitting: boolean;
  formErrors: FieldErrors<{
    responsible: string;
    email?: string;
    phone: string;
  }>;

  // Ações
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  addMember: (member: MemberDisplayData) => void;
  removeMember: (index: number) => void;
  handleSubmit: (e: React.FormEvent) => void;
  register: any;
}

export interface UseGroupInscriptionConfirmationReturn {
  confirmationData: GroupInscriptionConfirmationData | null;
  confirmationResult: {
    inscriptionId: string;
    paymentEnabled: boolean;
  } | null;
  isConfirming: boolean;
  isLoading: boolean;
  timeRemaining: number;
  handleConfirm: () => void;
  handleCancel: () => void;
  handlePayment: () => void;
  handleSkipPayment: () => void;
}

// Tipo para submissão de inscrição em grupo
export type GroupInscriptionSubmit = {
  eventId: string;
  responsible: string;
  email?: string;
  phone: string;
  members: member[];
};

export type member = {
  accountParticipantId: string;
  typeInscriptionId: string;
};

export type AxiosError = {
  response?: {
    data?: {
      message?: string;
    };
    status?: number;
    statusText?: string;
  };
  message?: string;
  code?: string;
};
