"use client";

import { useGlobalLoading } from "@/components/GlobalLoading";
import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import { useForm } from "react-hook-form";
import { createInscriptionAdmin } from "../../api/inscriptionAdmin/inscriptionAdmin";
import {
  CreateInscriptionAdminForm,
  createInscriptionAdminSchema,
} from "../../schema/inscriptionAdmin/createInscriptionAdminSchema";

export type UseFormCreateInscriptionAdmin = {
  form: ReturnType<typeof useForm<CreateInscriptionAdminForm>>;
  onSubmit: (event?: React.BaseSyntheticEvent) => Promise<{
    success: boolean;
    error?: string;
  }>;
};

export function useFormCreateInscriptionAdmin(): UseFormCreateInscriptionAdmin {
  const { setLoading } = useGlobalLoading();

  const form = useForm<CreateInscriptionAdminForm>({
    resolver: zodResolver(createInscriptionAdminSchema),

    defaultValues: {
      eventId: "",
      status: "PENDING",
      isGuest: false,

      accountId: undefined,

      responsible: "",
      email: "",
      phone: "",

      guestLocality: undefined,

      totalValue: 0,
      totalPaid: 0,

      participants: [],

      payment: undefined,
    },
  });

  async function onSubmit(event?: React.BaseSyntheticEvent) {
    if (event?.preventDefault) event.preventDefault();

    const values = form.getValues();

    setLoading(true);

    try {
      let imageBase64: string | undefined = undefined;

      if (values.payment?.image instanceof File) {
        imageBase64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(values.payment!.image as File);
        });
      }

      const payload = {
        ...values,
        participants: values.participants.map((p) => ({
          ...p,
          birthDate: p.birthDate
            ? dayjs(p.birthDate).format("YYYY-MM-DD")
            : undefined,
        })),
        payment: values.payment
          ? { ...values.payment, image: imageBase64 }
          : undefined,
      };

      await createInscriptionAdmin(payload);

      form.reset();

      return { success: true };
    } catch (error) {
      const err = error as Error;
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }

  return {
    form,
    onSubmit,
  };
}
