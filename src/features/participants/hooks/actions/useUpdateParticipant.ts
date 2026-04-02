import { updateParticipant } from "@/features/participants/api/actions/updateParticipant";
import {
  UpdateParticipantInput,
  UpdateParticipantResponse,
} from "@/features/participants/types/actions/updateParticipantTypes";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function useUpdateParcipant() {
  const router = useRouter();

  const {
    mutateAsync: updateParticipantMutation,
    isPending: isUpdatingParticipant,
  } = useMutation<UpdateParticipantResponse, Error, UpdateParticipantInput>({
    mutationFn: updateParticipant,
    onSuccess: (_data, variables) => {
      toast.success(`Participante ${variables.name} atualizado com sucesso`);
    },
    onError: (error) => {
      toast.error(`Erro ao atualizar os dados da inscrição: ${error.message}`);
    },
  });
}
