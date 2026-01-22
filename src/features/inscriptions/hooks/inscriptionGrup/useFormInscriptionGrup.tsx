"use client";

import { useGlobalLoading } from "@/components/GlobalLoading";
import {
  GroupInscriptionFormInputs,
  groupInscriptionSchema,
} from "@/features/inscriptions/schema/inscriptionGrup/grupInscriptionSchema";
import { useInvalidateMembersQuery } from "@/features/members/hook/useMembersQuery";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { submitGroupInscription } from "../../api/inscriptionGrup/submitGroupInscription";
import {
  MemberDisplayData,
  UseFormInscriptionGrupProps,
  UseFormInscriptionGrupReturn,
} from "../../types/inscriptionGrup/inscriptionGrupTypes";

export function useFormInscriptionGrup({
  eventId,
}: UseFormInscriptionGrupProps): UseFormInscriptionGrupReturn {
  // Inicializar o react-hook-form com Zod
  const {
    register,
    handleSubmit: rhfHandleSubmit,
    formState: { errors },
    setValue,
    watch,
    trigger,
  } = useForm<GroupInscriptionFormInputs>({
    resolver: zodResolver(groupInscriptionSchema),
    defaultValues: {
      responsible: "",
      email: undefined,
      phone: "",
    },
    mode: "onChange",
  });

  const [members, setMembers] = useState<MemberDisplayData[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { setLoading } = useGlobalLoading();
  const { invalidateLists } = useInvalidateMembersQuery();

  // Observar os valores do formulário
  const formData = watch();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "phone") {
      // Formatação automática do telefone
      const formattedPhone = formatPhone(value);
      setValue(name as keyof GroupInscriptionFormInputs, formattedPhone);
    } else if (name === "email") {
      const trimmed = value.trim();
      setValue(
        name as keyof GroupInscriptionFormInputs,
        trimmed.length === 0 ? undefined : trimmed,
      );
    } else {
      setValue(name as keyof GroupInscriptionFormInputs, value);
    }

    // Validação em tempo real
    trigger(name as keyof GroupInscriptionFormInputs);
  };

  // Função para formatar telefone
  const formatPhone = (value: string): string => {
    // Remove tudo que não é número
    const numbers = value.replace(/\D/g, "");

    // Aplica a máscara (11) 99999-9999
    if (numbers.length <= 2) {
      return numbers ? `(${numbers}` : "";
    } else if (numbers.length <= 6) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    } else if (numbers.length <= 10) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(
        7,
      )}`;
    } else {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(
        7,
        11,
      )}`;
    }
  };

  // Funções para manipulação de membros
  const addMember = (member: MemberDisplayData) => {
    setMembers([...members, member]);
    toast.success("Membro adicionado à lista!");
  };

  const removeMember = (index: number) => {
    const newMembers = [...members];
    newMembers.splice(index, 1);
    setMembers(newMembers);
    toast.info("Membro removido da lista");
  };

  const onSubmit = async (data: GroupInscriptionFormInputs) => {
    // Validar o formulário principal
    await trigger();

    // Verificar se há pelo menos um membro
    if (members.length === 0) {
      toast.warning("É necessário adicionar pelo menos um membro na inscrição");
      return;
    }

    setLoading(true);

    try {
      const response = await submitGroupInscription({
        eventId,
        responsible: data.responsible,
        email: data.email,
        phone: data.phone,
        members: members.map((member) => ({
          accountParticipantId: member.accountParticipantId,
          typeInscriptionId: member.typeInscriptionId,
        })),
      });

      // Mostrar toast de sucesso
      toast.success("Inscrição realizada com sucesso!", {
        description: `ID da inscrição: ${response.inscriptionId}`,
      });

      // Limpar formulário e lista
      invalidateLists();
      setMembers([]);
      setValue("responsible", "");
      setValue("email", undefined);
      setValue("phone", "");

      // Opcional: Redirecionar se desejar, mas o usuário pediu para simplificar
      // router.push("/user/events");
    } catch (error: unknown) {
      console.error("Erro:", error);

      // Type guard para verificar se é um erro com estrutura de resposta
      const isErrorWithResponse = (
        err: unknown,
      ): err is {
        response?: { status?: number; data?: { message?: string } };
      } => {
        return typeof err === "object" && err !== null && "response" in err;
      };

      // Type guard para verificar se é um erro do Next.js Server Action
      const isServerActionError = (
        err: unknown,
      ): err is { message?: string; name?: string } => {
        return (
          typeof err === "object" &&
          err !== null &&
          "message" in err &&
          "name" in err
        );
      };

      // Type guard para verificar se é um Error padrão
      const isStandardError = (err: unknown): err is Error => {
        return err instanceof Error;
      };

      let errorMessage =
        "Erro ao processar inscrição, verifique os dados e tente novamente.";

      if (isErrorWithResponse(error) && error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (isServerActionError(error)) {
        // Tratar erros específicos do Next.js Server Actions
        if (error.message?.includes("UnrecognizedActionError")) {
          errorMessage =
            "Erro de conexão com o servidor. Tente novamente em alguns instantes.";
        } else {
          errorMessage = error.message || "Erro desconhecido do servidor.";
        }
      } else if (isStandardError(error)) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Wrapper para o handleSubmit do react-hook-form
  const handleFormSubmit = rhfHandleSubmit(onSubmit);

  return {
    // Estado
    formData,
    members,
    isSubmitting,
    formErrors: errors,

    // Ações
    handleInputChange,
    addMember,
    removeMember,
    handleSubmit: handleFormSubmit,
    register,
  };
}
