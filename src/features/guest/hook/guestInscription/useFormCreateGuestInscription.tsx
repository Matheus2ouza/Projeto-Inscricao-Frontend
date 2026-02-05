"use client";

import { useGlobalLoading } from "@/components/GlobalLoading";
import { registerGuest } from "@/features/guest/api/guestInscription/registerGuest";
import { useDetailsEvent } from "@/features/guest/hook/guestInscription/useDetailsEvent";
import { guestInscriptionSchema } from "@/features/guest/schema/guestInscription/guestInscriptionSchema";
import {
  GuestInscriptionFormInputs,
  RegisterGuestInscriptionResponse,
  UseFormGuestInscriptionProps,
  UseFormGuestInscriptionReturn,
} from "@/features/guest/types/guestInscription/guestInscriptionTypes";
import { setWithExpiry } from "@/shared/utils/storageWithExpiry";
import { zodResolver } from "@hookform/resolvers/zod";
import * as React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";

// Funções auxiliares puras
const formatPhone = (value: string): string => {
  const numbers = value.replace(/\D/g, "");
  if (numbers.length <= 2) return numbers ? `(${numbers}` : "";
  if (numbers.length <= 6)
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
  if (numbers.length <= 10)
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`;
  return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
};

const formatDate = (value: string): string => {
  const numbers = value.replace(/\D/g, "");
  if (numbers.length <= 2) return numbers;
  if (numbers.length <= 4) return `${numbers.slice(0, 2)}/${numbers.slice(2)}`;
  return `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}/${numbers.slice(4, 8)}`;
};

export function useFormCreateGuestInscription({
  eventId,
  onSuccess,
}: UseFormGuestInscriptionProps): UseFormGuestInscriptionReturn {
  const { setLoading } = useGlobalLoading();

  const form = useForm<
    GuestInscriptionFormInputs,
    any,
    GuestInscriptionFormInputs
  >({
    resolver: zodResolver(guestInscriptionSchema),
    defaultValues: {
      name: "",
      preferredName: "",
      email: "",
      phone: "",
      locality: "",
      participantName: "",
      birthDate: "",
      gender: "",
      shirtSize: undefined,
      shirtType: undefined,
      typeInscriptionId: "",
      isResponsibleParticipant: false,
    },
    mode: "onChange",
  });

  const { watch, setValue, trigger, formState } = form;
  const formData = watch();
  const { event } = useDetailsEvent({ eventId });
  const typeInscriptions = React.useMemo(
    () => event?.typeInscriptions || [],
    [event],
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const fieldName = name as keyof GuestInscriptionFormInputs;

    if (name === "phone") {
      setValue(fieldName, formatPhone(value));
    } else if (name === "birthDate") {
      setValue(fieldName, formatDate(value));
    } else {
      setValue(
        fieldName,
        value === "true" ? true : value === "false" ? false : value,
      );
    }

    trigger(fieldName);
  };

  const filteredTypeInscriptions = React.useMemo(() => {
    if (!formData.birthDate || formData.birthDate.length < 10)
      return typeInscriptions;

    const [day, month, year] = formData.birthDate.split("/").map(Number);
    const birthDate = new Date(year, month - 1, day);

    if (isNaN(birthDate.getTime())) return typeInscriptions;

    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return typeInscriptions.filter((type) => {
      if (!type.rule) return true;
      const ruleDate = new Date(type.rule);
      let ruleAge = today.getFullYear() - ruleDate.getFullYear();
      const mr = today.getMonth() - ruleDate.getMonth();
      if (mr < 0 || (mr === 0 && today.getDate() < ruleDate.getDate())) {
        ruleAge--;
      }
      return age <= ruleAge;
    });
  }, [formData.birthDate, typeInscriptions]);

  const onSubmit: SubmitHandler<GuestInscriptionFormInputs> = async (data) => {
    setLoading(true);
    try {
      const [day, month, year] = data.birthDate.split("/").map(Number);
      const birthDate = new Date(year, month - 1, day);

      const payload = {
        eventId,
        guestEmail: data.email,
        guestName: data.name,
        guestLocality: data.locality,
        phone: data.phone,
        participant: {
          name: data.isResponsibleParticipant
            ? data.participantName || ""
            : data.name,
          preferredName: data.preferredName,
          birthDate: birthDate,
          gender: data.gender,
          shirtSize: data.shirtSize,
          shirtType: data.shirtType,
          typeInscriptionId: data.typeInscriptionId,
        },
      };

      const response: RegisterGuestInscriptionResponse =
        await registerGuest(payload);

      if (typeof window !== "undefined") {
        setWithExpiry(
          "guest_inscription",
          {
            eventId,
            confirmationCode: response.confirmationCode,
          },
          30 * 60 * 1000,
        );
      }

      form.reset();
      onSuccess?.(response);
    } catch (error) {
      console.error("Erro na inscrição:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Erro ao realizar inscrição. Tente novamente.",
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    typeInscriptions: filteredTypeInscriptions,
    isSubmitting: formState.isSubmitting,
    formErrors: formState.errors,
    register: form.register,
    handleSubmit: form.handleSubmit(onSubmit),
    handleInputChange,
    setValue,
    control: form.control,
    form,
  };
}
