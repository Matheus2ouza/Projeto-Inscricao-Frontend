import { useState } from "react";
import { toast } from "sonner";
import {
  createTypeInscription,
  CreateTypeInscriptionInput,
} from "../api/createTypeInscription";
import { deleteTypeInscription } from "../api/deleteTypeInscription";
import {
  updateTypeInscription,
  UpdateTypeInscriptionInput,
} from "../api/updateTypeInscription";

export function useTypeInscriptionsActions(eventId: string) {
  const [loading, setLoading] = useState(false);

  const create = async (input: CreateTypeInscriptionInput) => {
    try {
      setLoading(true);
      const newType = await createTypeInscription(input);
      toast.success("Tipo de inscrição criado com sucesso!");
      return newType;
    } catch (error) {
      const err = error as Error;
      toast.error("Erro ao criar tipo de inscrição", {
        description: err.message,
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const update = async (
    typeInscriptionId: string,
    input: UpdateTypeInscriptionInput,
  ) => {
    try {
      setLoading(true);
      const updatedType = await updateTypeInscription(typeInscriptionId, input);
      toast.success("Tipo de inscrição atualizado com sucesso!");
      return updatedType;
    } catch (error) {
      toast.error("Erro ao atualizar tipo de inscrição");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const remove = async (typeInscriptionId: string) => {
    try {
      setLoading(true);
      await deleteTypeInscription(typeInscriptionId);
      toast.success("Tipo de inscrição excluído com sucesso!");
    } catch (error) {
      toast.error("Erro ao excluir tipo de inscrição");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    create,
    update,
    remove,
  };
}
