"use client";

import { useGlobalLoading } from "@/components/GlobalLoading";
import { zodResolver } from "@hookform/resolvers/zod";
import { ThumbsDown } from "lucide-react";
import { useState } from "react";
import { DateRange } from "react-day-picker";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useInvalidateEventsQuery } from "../../../gastos/hooks/useSelectEventsQuery";
import { registerEvent } from "../../api/create/registerEvent";
import {
  CreateEventSchema,
  type CreateEventFormType,
} from "../../schema/create/CreateEventSchema";
import { CreateEventRequest } from "../../types/create/createEvent";
import { StatusEvent } from "../../types/eventTypes";

export type useFormCreateEvent = {
  form: ReturnType<typeof useForm<CreateEventFormType>>;
  onSubmit: (
    event?: React.BaseSyntheticEvent
  ) => Promise<{ success: boolean; id?: string }>;
  dateRange: DateRange | undefined;
  setDateRange: (dateRange: DateRange | undefined) => void;
};

// Função para converter File para base64
const convertFileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64String = reader.result as string;
      resolve(base64String);
    };
    reader.onerror = (error) => reject(error);
  });
};

// Função para converter Date para ISO string
const convertToISOString = (date: Date): string => {
  const newDate = new Date(date);
  newDate.setHours(20, 0, 0, 0); // Define como 20:00:00
  return newDate.toISOString();
};

export default function useFormCreateEvent(): useFormCreateEvent {
  const { setLoading } = useGlobalLoading();
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: new Date(new Date().setDate(new Date().getDate() + 3)),
  });
  const { invalidateList } = useInvalidateEventsQuery();

  const form = useForm<CreateEventFormType>({
    resolver: zodResolver(CreateEventSchema),
    defaultValues: {
      name: "",
      regionId: "",
      accountIds: [],
      location: undefined,
      openImmediately: false,
    },
  });

  async function onCreateForm(
    input: CreateEventFormType
  ): Promise<{ success: boolean; id?: string }> {
    try {
      setLoading(true);

      // Validar se as datas foram selecionadas
      if (!dateRange?.from || !dateRange?.to) {
        toast.error("Período inválido", {
          description: "Selecione as datas de início e término do evento.",
          icon: <ThumbsDown />,
        });
        return { success: false };
      }

      // Validar se a data final é posterior à data inicial
      if (dateRange.to < dateRange.from) {
        toast.error("Período inválido", {
          description: "A data de término deve ser posterior à data de início.",
          icon: <ThumbsDown />,
        });
        return { success: false };
      }

      // Converter imagem para base64 se existir
      let imageBase64: string | undefined;
      if (input.image) {
        imageBase64 = await convertFileToBase64(input.image);
      }

      // Converter datas para o formato ISO esperado pela API
      const startDateISO = convertToISOString(dateRange.from);
      const endDateISO = convertToISOString(dateRange.to);

      const registrationStatus: StatusEvent = input.openImmediately
        ? "OPEN"
        : "CLOSE";

      const responsibles = input.accountIds?.map((accountId) => ({
        accountId,
      }));

      const eventData: CreateEventRequest = {
        name: input.name,
        startDate: new Date(startDateISO),
        endDate: new Date(endDateISO),
        regionId: input.regionId,
        image: imageBase64,
        latitude: input.location?.lat,
        longitude: input.location?.lng,
        location: input.location?.address,
        status: registrationStatus,
        paymentEnabled: false,
        responsibles,
      };

      const { id } = await registerEvent(eventData);

      // Invalidar cache da lista assim que um novo evento é criado
      invalidateList();

      form.reset();
      setDateRange({
        from: new Date(),
        to: new Date(new Date().setDate(new Date().getDate() + 3)),
      });
      return { success: true, id };
    } catch (error) {
      const err = error as Error;
      toast.error("Erro ao criar evento", {
        description: err.message,
        icon: <ThumbsDown />,
      });
      return { success: false };
    } finally {
      setLoading(false);
    }
  }

  const onSubmit = async (event?: React.BaseSyntheticEvent) => {
    let result: { success: boolean; id?: string } = { success: false };
    await form.handleSubmit(async (data) => {
      result = await onCreateForm(data);
    })(event);
    return result;
  };

  return {
    form,
    onSubmit,
    dateRange,
    setDateRange,
  };
}
