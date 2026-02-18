import { UpdateGuestParticipantFormInputs } from "@/features/guest/schema/actions/updateGuestParticipantSchema";

export interface UseUpdateParticipantOptions {
  participantId: string;
  initialValues?: Partial<UpdateGuestParticipantFormInputs>;
  onSuccess?: () => void;
}

export enum GenderType {
  MASCULINO = "MASCULINO",
  FEMININO = "FEMININO",
}

export enum ShirtSize {
  PP = "PP",
  P = "P",
  M = "M",
  G = "G",
  GG = "GG",
  XG = "XG",
}

export enum ShirtType {
  TRADICIONAL = "TRADICIONAL",
  BABYLOOK = "BABYLOOK",
}

export type UpdateGuestParticipantInput = {
  participantId: string;
  name?: string;
  birthDate?: Date;
  gender?: GenderType;
  preferredName?: string;
  shirtSize?: ShirtSize;
  shirtType?: ShirtType;
};

export type UpdateGuestParticipantResult = {
  id: string;
};
