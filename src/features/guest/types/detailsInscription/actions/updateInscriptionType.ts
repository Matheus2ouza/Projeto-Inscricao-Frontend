import { UpdateGuestInscriptionFormInputs } from "@/features/guest/schema/actions/updateGuestInscriptionSchema";

export interface useUpdateInscriptionOptions {
  inscriptionId: string;
  initialValues?: Partial<UpdateGuestInscriptionFormInputs>;
  onSuccess?: () => void;
}

export type UpdateGuestInscriptionInput = {
  inscriptionId: string;
  guestName?: string;
  guestEmail?: string;
  guestLocality?: string;
  phone?: string;
};

export type UpdateGuestInscriptionResult = {
  id: string;
};
