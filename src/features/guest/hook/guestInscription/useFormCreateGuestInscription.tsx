"use client";

import { useGlobalLoading } from "@/components/GlobalLoading";
import { GuestInscriptionSchemaType } from "@/features/guest/schema/guestInscription/guestInscriptionSchema";
import { InscriptionStatus } from "@/features/guest/types/guestInscription/guestInscriptionTypes";
import dayjs from "dayjs";
import * as React from "react";
import { toast } from "sonner";
import { registerGuest } from "../../api/guestInscription/registerGuest";

export type UseCreateGuestInscription = {
  initialValues: GuestInscriptionSchemaType;
  submit: (values: GuestInscriptionSchemaType) => Promise<{
    success?: {
      id: string;
      status: InscriptionStatus;
      confirmationCode: string;
    };
    error?: string;
  }>;
};

export function useFormCreateGuestInscription(
  eventId: string,
  typeInscriptionId: string,
): UseCreateGuestInscription {
  const { setLoading } = useGlobalLoading();
  const today = dayjs().format("YYYY-MM-DD");

  const initialValues: GuestInscriptionSchemaType = React.useMemo(
    () => ({
      name: "",
      preferredName: "",
      email: "",
      phone: "",
      cpf: "",
      gender: "FEMININO",
      locality: "",
      birthDate: today,
      shirtSize: "M",
    }),
    [today],
  );

  async function submit(values: GuestInscriptionSchemaType) {
    setLoading(true);

    try {
      const response = await registerGuest({
        ...values,
        eventId,
        typeInscriptionId,
      });

      return {
        success: {
          id: response.id,
          status: response.status,
          confirmationCode: response.confirmationCode,
        },
      };
    } catch (error) {
      const err = error as Error;
      toast.error(err.message);
      return { error: err.message };
    } finally {
      setLoading(false);
    }
  }

  return {
    initialValues,
    submit,
  };
}
