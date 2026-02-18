import { useGlobalLoading } from "@/components/GlobalLoading";
import { updateGuestInscription } from "@/features/guest/api/detailsInscription/actions/updateInscription";
import {
  UpdateGuestInscriptionFormInputs,
  UpdateGuestInscriptionSchema,
} from "@/features/guest/schema/actions/updateGuestInscriptionSchema";
import { useUpdateInscriptionOptions } from "@/features/guest/types/detailsInscription/actions/updateInscriptionType";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useInvalidateDetailsGuestInscriptionQuery } from "../useDetailsInscriptionQuery";

export function useUpdateGuestInscription({
  inscriptionId,
  initialValues,
  onSuccess,
}: useUpdateInscriptionOptions) {
  const { setLoading } = useGlobalLoading();
  const { invalidateAll } = useInvalidateDetailsGuestInscriptionQuery();

  const form = useForm<UpdateGuestInscriptionFormInputs>({
    resolver: zodResolver(UpdateGuestInscriptionSchema),
    defaultValues: {
      guestName: initialValues?.guestName,
      guestEmail: initialValues?.guestEmail,
      guestLocality: initialValues?.guestLocality,
      phone: initialValues?.phone,
    },
  });

  useEffect(() => {
    if (!initialValues) return;

    form.reset({
      guestName: initialValues.guestName ?? "",
      guestEmail: initialValues.guestEmail ?? "",
      guestLocality: initialValues.guestLocality ?? "",
      phone: initialValues.phone ?? "",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    initialValues?.guestName,
    initialValues?.guestEmail,
    initialValues?.guestLocality,
    initialValues?.phone,
    form,
  ]);

  const updateInscription = useMutation({
    mutationFn: async (data: UpdateGuestInscriptionFormInputs) => {
      if (!inscriptionId) {
        throw new Error("Inscription ID is required");
      }
      return updateGuestInscription({
        inscriptionId,
        ...data,
      });
    },
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: () => {
      invalidateAll();
      toast.success("Inscrição atualizada com sucesso");
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao atualizar inscrição.");
    },
    onSettled: () => {
      setLoading(false);
    },
  });

  const handleUpdateInscription = form.handleSubmit((values) =>
    updateInscription.mutate(values),
  );

  return {
    form,
    handleUpdateInscription,
  };
}
