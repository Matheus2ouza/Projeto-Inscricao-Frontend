"use client";

import { deleteInscription } from "@/features/inscriptions/api/analysis/inscription/actions/deleteInscription";
import { updateInscriptionStatus } from "@/features/inscriptions/api/analysis/inscription/actions/updateInscriptionStatus";
import {
  inscriptionsForAnalysisKeys,
  useInvalidateAnalysisInscriptions,
} from "@/features/inscriptions/hooks/analysis/useInscriptionsForAnalysisQuery";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function useInscriptionActions() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { invalidateAll, invalidateInscriptionDetails } =
    useInvalidateAnalysisInscriptions();

  // Atualizar status da inscrição (aprovar/cancelar)
  const updateStatusMutation = useMutation({
    mutationFn: ({
      inscriptionId,
      status,
    }: {
      inscriptionId: string;
      status: "PENDING" | "CANCELLED";
    }) => updateInscriptionStatus(inscriptionId, status),
    onSuccess: (_, { inscriptionId }) => {
      // Invalidar cache da inscrição específica e listas
      invalidateInscriptionDetails(inscriptionId);
      invalidateAll();
    },
  });

  // Deletar inscrição
  const deleteMutation = useMutation({
    mutationFn: deleteInscription,
    onMutate: (inscriptionId: string) => {
      // Marcar inscrição como deletada no cache (persistir mesmo após invalidação)
      queryClient.setQueryData(
        ["deleted-inscriptions"],
        (old: Set<string> | undefined) => {
          const deletedSet = old || new Set();
          deletedSet.add(inscriptionId);
          return new Set(deletedSet);
        },
      );

      // Cancelar todas as queries relacionadas à inscrição antes de deletar
      queryClient.cancelQueries({
        queryKey:
          inscriptionsForAnalysisKeys.inscriptionDetailsBase(inscriptionId),
      });

      // Remover dados da inscrição do cache
      queryClient.removeQueries({
        queryKey:
          inscriptionsForAnalysisKeys.inscriptionDetailsBase(inscriptionId),
      });
    },
    onSuccess: (_, inscriptionId) => {
      // Garantir que a inscrição permaneça marcada como deletada
      queryClient.setQueryData(
        ["deleted-inscriptions"],
        (old: Set<string> | undefined) => {
          const deletedSet = old || new Set();
          deletedSet.add(inscriptionId);
          return new Set(deletedSet);
        },
      );

      // Invalidar apenas as listas de inscrições, não o cache de deletadas
      queryClient.invalidateQueries({
        queryKey: inscriptionsForAnalysisKeys.all,
        predicate: (query) => {
          // Invalidar apenas queries de listas, não o cache de deletadas
          return (
            query.queryKey.includes("eventInscriptions") ||
            query.queryKey.includes("events") ||
            (query.queryKey.includes("inscriptionDetails") &&
              !query.queryKey.includes(inscriptionId))
          );
        },
      });

      // Voltar para a página anterior (lista de inscrições do evento)
      router.back();
    },
    onError: (error, inscriptionId) => {
      // Em caso de erro, remover a marcação de deletada
      queryClient.setQueryData(
        ["deleted-inscriptions"],
        (old: Set<string> | undefined) => {
          if (!old) return new Set();
          const deletedSet = new Set(old);
          deletedSet.delete(inscriptionId);
          return deletedSet;
        },
      );
    },
  });

  // Função para aprovar inscrição
  const handleApproveInscription = async (inscriptionId: string) => {
    try {
      await updateStatusMutation.mutateAsync({
        inscriptionId,
        status: "PENDING",
      });
      toast.success("Inscrição aprovada com sucesso!");
    } catch (error) {
      console.error("Erro ao aprovar inscrição:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Erro ao aprovar inscrição. Tente novamente.";
      toast.error(errorMessage);
    }
  };

  // Função para cancelar/reativar inscrição
  const handleCancelInscription = async (
    inscriptionId: string,
    currentStatus: string,
  ) => {
    try {
      const newStatus =
        currentStatus.toLowerCase() === "cancelled" ? "PENDING" : "CANCELLED";
      const action =
        currentStatus.toLowerCase() === "cancelled" ? "reativada" : "cancelada";

      await updateStatusMutation.mutateAsync({
        inscriptionId,
        status: newStatus as "PENDING" | "CANCELLED",
      });
      toast.success(`Inscrição ${action} com sucesso!`);
    } catch (error) {
      const action =
        currentStatus.toLowerCase() === "cancelled" ? "reativar" : "cancelar";
      console.error(`Erro ao ${action} inscrição:`, error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : `Erro ao ${action} inscrição. Tente novamente.`;
      toast.error(errorMessage);
    }
  };

  // Função para deletar inscrição
  const handleDeleteInscription = async (inscriptionId: string) => {
    try {
      await deleteMutation.mutateAsync(inscriptionId);
      toast.success("Inscrição deletada com sucesso!");
    } catch (error) {
      console.error("Erro ao deletar inscrição:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Erro ao deletar inscrição. Tente novamente.";
      toast.error(errorMessage);
    }
  };

  return {
    approveInscription: handleApproveInscription,
    cancelInscription: handleCancelInscription,
    deleteInscription: handleDeleteInscription,
    isApproving: updateStatusMutation.isPending,
    isCancelling: updateStatusMutation.isPending,
    isDeleting: deleteMutation.isPending,
    approveError: updateStatusMutation.error,
    cancelError: updateStatusMutation.error,
    deleteError: deleteMutation.error,
  };
}
