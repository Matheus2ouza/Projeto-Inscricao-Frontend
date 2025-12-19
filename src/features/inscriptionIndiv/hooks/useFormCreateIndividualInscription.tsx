"use client";

import { useGlobalLoading } from "@/components/GlobalLoading";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm, UseFormRegister } from "react-hook-form";
import { toast } from "sonner";
import {
  IndividualInscriptionFormInputs,
  individualInscriptionSchema,
} from "../schemas/individualInscriptionSchema";
import {
  FormErrors,
  IndividualInscriptionSubmit,
  UseFormIndividualInscriptionProps,
  UseFormIndividualInscriptionReturn,
} from "../types/individualInscriptionTypes";
import { useSubmitIndividualInscription } from "./useIndividualInscriptionQuery";
import { useTypeInscriptionsQuery } from "./useTypeInscriptionsQuery";

export function useFormCreateIndividualInscription({
  eventId,
}: UseFormIndividualInscriptionProps): UseFormIndividualInscriptionReturn {
  const router = useRouter();
  const { setLoading } = useGlobalLoading();

  // Inicializar o react-hook-form com Zod
  const {
    register,
    handleSubmit: rhfHandleSubmit,
    formState: { errors },
    setValue,
    watch,
    trigger,
  } = useForm<IndividualInscriptionFormInputs>({
    resolver: zodResolver(individualInscriptionSchema),
    defaultValues: {
      responsible: "",
      email: undefined,
      phone: "",
      participantName: "",
      birthDate: "",
      gender: "",
      typeInscriptionId: "",
    },
    mode: "onChange",
  });

  // Observar os valores do formulário
  const formData = watch();

  // Usar React Query para carregar tipos de inscrição
  const { data: typeInscriptionsData, error: typeInscriptionsError } =
    useTypeInscriptionsQuery(eventId);

  // Usar React Query para submeter inscrição
  const submitMutation = useSubmitIndividualInscription();

  // Processar dados dos tipos de inscrição
  const typeInscriptions = typeInscriptionsData
    ? Array.isArray(typeInscriptionsData)
      ? typeInscriptionsData
      : [typeInscriptionsData]
    : [];

  // Mostrar erro se houver
  if (typeInscriptionsError) {
    console.error(
      "Erro ao carregar tipos de inscrição:",
      typeInscriptionsError
    );
    toast.error("Erro ao carregar tipos de inscrição");
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "phone") {
      // Formatação automática do telefone
      const formattedPhone = formatPhone(value);
      setValue(name as keyof IndividualInscriptionFormInputs, formattedPhone);
    } else if (name === "birthDate") {
      // Formatação automática da data
      const formattedDate = formatDate(value);
      setValue(name as keyof IndividualInscriptionFormInputs, formattedDate);
    } else if (name === "email") {
      const trimmed = value.trim();
      setValue(
        name as keyof IndividualInscriptionFormInputs,
        (trimmed.length === 0 ? undefined : trimmed) as never
      );
    } else {
      setValue(name as keyof IndividualInscriptionFormInputs, value);
    }

    // Validação em tempo real
    trigger(name as keyof IndividualInscriptionFormInputs);
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
        7
      )}`;
    } else {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(
        7,
        11
      )}`;
    }
  };

  // Função para formatar data
  const formatDate = (value: string): string => {
    // Remove tudo que não é número
    const numbers = value.replace(/\D/g, "");

    // Aplica a máscara DD/MM/AAAA
    if (numbers.length <= 2) {
      return numbers;
    } else if (numbers.length <= 4) {
      return `${numbers.slice(0, 2)}/${numbers.slice(2)}`;
    } else {
      return `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}/${numbers.slice(
        4,
        8
      )}`;
    }
  };

  const onSubmit = async (data: IndividualInscriptionFormInputs) => {
    const apiData: IndividualInscriptionSubmit = {
      responsible: data.responsible,
      phone: data.phone,
      eventId,
      participant: {
        name: data.participantName,
        birthDateStr: data.birthDate,
        gender: data.gender,
        typeDescriptionId: data.typeInscriptionId,
      },
    };

    if (data.email) {
      apiData.email = data.email;
    }

    setLoading(true);
    try {
      const response = await submitMutation.mutateAsync(apiData);

      // Salvar os dados completos no localStorage
      if (response.cacheKey) {
        localStorage.setItem(
          `individual-inscription-${response.cacheKey}`,
          JSON.stringify(response)
        );

        toast.success(
          "Dados processados com sucesso! Verifique as informações antes de confirmar."
        );
        router.push(
          `/user/individual-inscription/confirm/${response.cacheKey}`
        );
      } else {
        toast.success("Inscrição individual realizada com sucesso!");
        router.push("/user/events");
      }
    } catch (error: unknown) {
      console.error("Erro:", error);

      // Type guard para verificar se é um erro com estrutura de resposta
      const isErrorWithResponse = (
        err: unknown
      ): err is {
        response?: { status?: number; data?: { message?: string } };
      } => {
        return typeof err === "object" && err !== null && "response" in err;
      };

      // Type guard para verificar se é um erro do Next.js Server Action
      const isServerActionError = (
        err: unknown
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
    typeInscriptions,
    isSubmitting: submitMutation.isPending,
    formErrors: errors as FormErrors,

    // Ações
    handleInputChange,
    handleSubmit: handleFormSubmit,
    register: register as UseFormRegister<IndividualInscriptionFormInputs>,
  };
}
