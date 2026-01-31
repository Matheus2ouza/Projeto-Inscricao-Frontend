import type {
  Control,
  FieldErrors,
  UseFormRegister,
  UseFormReturn,
  UseFormSetValue,
} from "react-hook-form";
import type { GuestInscriptionSchemaFormInput } from "../../schema/guestInscription/guestInscriptionSchema";

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
};

export type UseDetailsEventParams = {
  eventId: string;
};

export type UseDetailsEventResult = {
  event: Event | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
};

//Tipagens para o formulário de inscrição
export type UseFormGuestInscriptionProps = {
  eventId: string;
  onSuccess?: (response: RegisterGuestInscriptionResponse) => void;
};

export type GuestInscriptionFormInputs = GuestInscriptionSchemaFormInput;

export enum InscriptionStatus {
  PENDING = "PENDING",
  UNDER_REVIEW = "UNDER_REVIEW",
  PAID = "PAID",
  CANCELLED = "CANCELLED",
}

export type GenderType = "M" | "F" | "O" | string;

export type ParticipantGuest = {
  name: string;
  birthDate: Date;
  gender: GenderType;
  typeInscriptionId: string;
};

export type RegisterGuestInscriptionInput = {
  eventId: string;
  guestEmail: string;
  guestName: string;
  guestLocality: string;
  phone: string;
  participant: ParticipantGuest;
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
