import { useGlobalLoading } from "@/components/GlobalLoading";
import { updateGuestParticipant } from "@/features/guest/api/detailsInscription/actions/updateParticipant";
import {
  UpdateGuestParticipantFormInputs,
  UpdateGuestParticipantSchema,
} from "@/features/guest/schema/actions/updateGuestParticipantSchema";
import {
  GenderType,
  ShirtSize,
  ShirtType,
  UseUpdateParticipantOptions,
} from "@/features/guest/types/detailsInscription/actions/updateParticipantType";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useInvalidateDetailsGuestInscriptionQuery } from "../useDetailsInscriptionQuery";

export function useUpdateGuestParticipant({
  participantId,
  initialValues,
  onSuccess,
}: UseUpdateParticipantOptions) {
  const { setLoading } = useGlobalLoading();
  const { invalidateAll } = useInvalidateDetailsGuestInscriptionQuery();

  const form = useForm<UpdateGuestParticipantFormInputs>({
    resolver: zodResolver(UpdateGuestParticipantSchema),
    defaultValues: {
      name: initialValues?.name,
      preferredName: initialValues?.preferredName,
      birthDate: initialValues?.birthDate,
      shirtSize: initialValues?.shirtSize,
      shirtType: initialValues?.shirtType,
      gender: initialValues?.gender,
    },
  });

  useEffect(() => {
    if (!initialValues) return;

    form.reset({
      name: initialValues.name ?? "",
      preferredName: initialValues.preferredName ?? "",
      birthDate: initialValues.birthDate ?? "",
      shirtSize: initialValues.shirtSize ?? "",
      shirtType: initialValues.shirtType ?? "",
      gender: initialValues.gender ?? "",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    initialValues?.name,
    initialValues?.preferredName,
    initialValues?.birthDate,
    initialValues?.shirtSize,
    initialValues?.shirtType,
    initialValues?.gender,
    form,
  ]);

  const updateParticipant = useMutation({
    mutationFn: async (data: UpdateGuestParticipantFormInputs) => {
      if (!participantId) {
        throw new Error("Participant ID is required");
      }
      return updateGuestParticipant({
        participantId,
        ...data,
        gender: data.gender as GenderType,
        shirtSize: data.shirtSize as ShirtSize,
        shirtType: data.shirtType as ShirtType,
        birthDate: new Date(data.birthDate),
      });
    },
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: () => {
      invalidateAll();
      toast.success("Participante atualizado com sucesso");
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao atualizar participante.");
    },
    onSettled: () => {
      setLoading(false);
    },
  });

  const handleUpdateParticipant = form.handleSubmit((values) =>
    updateParticipant.mutate(values),
  );

  return {
    form,
    handleUpdateParticipant,
  };
}
