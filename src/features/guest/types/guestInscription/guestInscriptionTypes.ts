import type {
  Control,
  FieldErrors,
  UseFormRegister,
  UseFormReturn,
  UseFormSetValue,
} from 'react-hook-form';
import type { GuestInscriptionSchemaType } from '../../schema/guestInscription/guestInscriptionSchema';

export type Event = {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  imageUrl?: string;
  status: string;
  paymentEnabled: boolean;
  typeInscriptions: TypeInscription[];
};

export type TypeInscription = {
  id: string;
  description: string;
  value: number;
  rule?: Date;
  specialType: boolean;
};

export type UseDetailsEventParams = {
  eventId: string;
};

export type UseDetailsEventResult = {
  event: Event | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
};

//Tipagens para o formulário de inscrição
export type UseFormGuestInscriptionProps = {
  eventId: string;
  onSuccess?: (response: RegisterGuestInscriptionResponse) => void;
};

export type GuestInscriptionFormInputs = GuestInscriptionSchemaType;

export enum InscriptionStatus {
  PENDING = 'PENDING',
  UNDER_REVIEW = 'UNDER_REVIEW',
  PAID = 'PAID',
  CANCELLED = 'CANCELLED',
}

export type GenderType = 'MASCULINO' | 'FEMININO' | string;

export type ShirtSizeType = 'PP' | 'P' | 'M' | 'G' | 'GG' | 'XG' | string;

export type ShirtType = 'TRADICIONAL' | 'BABYLOOK' | string;

export type RegisterGuestInscriptionInput = {
  eventId: string;

  // Dados do inscrito guest
  email: string;
  name: string;
  preferredName?: string;
  cpf: string;
  gender: GenderType;
  phone: string;
  locality: string;
  birthDate: Date | string;

  // dados complementares
  shirtSize?: ShirtSizeType;

  // id da inscrição
  typeInscriptionId: string;
};

export type RegisterGuestInscriptionResponse = {
  id: string;
  status: InscriptionStatus;
  confirmationCode: string;
};

export type GuestInscriptionFormControl = Control<
  GuestInscriptionFormInputs,
  any,
  GuestInscriptionFormInputs
>;

export type GuestInscriptionFormReturn = UseFormReturn<
  GuestInscriptionFormInputs,
  any,
  GuestInscriptionFormInputs
>;

export interface UseFormGuestInscriptionReturn {
  formData: GuestInscriptionFormInputs;
  typeInscriptions: TypeInscription[];
  isSubmitting: boolean;
  formErrors: FieldErrors<GuestInscriptionFormInputs>;
  register: UseFormRegister<GuestInscriptionFormInputs>;
  handleSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setValue: UseFormSetValue<GuestInscriptionFormInputs>;
  control: GuestInscriptionFormControl;
  form: GuestInscriptionFormReturn;
}
