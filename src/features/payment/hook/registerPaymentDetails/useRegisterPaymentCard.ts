import { useGlobalLoading } from "@/components/GlobalLoading";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { registerPaymentCard } from "../../api/registerPayment/registerPaymentCard";
import {
  registerPaymentCardSchema,
  RegisterPaymentCardSchema,
} from "../../schema/registerPaymendCarcSchema";
import { useInvalidateRegisterPaymentDetailsQuery } from "./registerPaymentDetailsQuery";

export type UseFormCreatePaymentCard = {
  form: ReturnType<typeof useForm<RegisterPaymentCardSchema>>;
  onSubmit: (
    eventId: string,
    totalValue: number,
    inscriptionIds: string[],
    userId?: string,
  ) => Promise<{
    success: boolean;
    error?: string;
    redirectUrl?: string;
  }>;
};

export default function useFormCreatePaymentCard(): UseFormCreatePaymentCard {
  const { setLoading } = useGlobalLoading();
  const { invalidateLists } = useInvalidateRegisterPaymentDetailsQuery();

  const form = useForm<RegisterPaymentCardSchema>({
    resolver: zodResolver(registerPaymentCardSchema),
    defaultValues: {
      name: "",
      email: "",
      telefone: "",
      cpfCnpj: "",
      address: "",
      addressNumber: "",
      complement: "",
      postalCode: "",
      province: "",
      city: "",
    },
  });

  const normalizeRedirectUrl = (rawUrl: unknown): string | null => {
    if (typeof rawUrl !== "string") return null;
    let url = rawUrl.trim();
    if (!url) return null;

    const wrappers: Array<[string, string]> = [
      ["`", "`"],
      ['"', '"'],
      ["'", "'"],
    ];

    for (const [start, end] of wrappers) {
      if (url.startsWith(start) && url.endsWith(end)) {
        url = url.slice(start.length, url.length - end.length).trim();
      }
    }

    if (!url) return null;

    try {
      const parsed = new URL(url);
      if (parsed.protocol !== "http:" && parsed.protocol !== "https:")
        return null;
      return parsed.toString();
    } catch {
      return null;
    }
  };

  async function onSubmit(
    eventId: string,
    totalValue: number,
    inscriptionIds: string[],
    userId?: string,
  ) {
    const isValid = await form.trigger();
    if (!isValid) {
      return {
        success: false,
        error: "Verifique os campos e tente novamente.",
      };
    }

    if (!Array.isArray(inscriptionIds) || inscriptionIds.length === 0) {
      return {
        success: false,
        error: "Nenhuma inscrição selecionada.",
      };
    }

    const values = form.getValues();
    setLoading(true);
    try {
      const result = await registerPaymentCard({
        eventId,
        totalValue,
        accountId: userId,
        inscriptions: inscriptionIds.map((id) => ({ id })),
        client: {
          name: values.name,
          email: values.email,
          phone: values.telefone.replace(/\D/g, ""),
          cpfCnpj: values.cpfCnpj.replace(/\D/g, ""),
          address: values.address,
          addressNumber: values.addressNumber,
          complement: values.complement,
          postalCode: values.postalCode.replace(/\D/g, ""),
          province: values.province,
          city: values.city,
        },
      });
      const redirectUrl = normalizeRedirectUrl(result?.link);
      if (!redirectUrl) {
        return {
          success: false,
          error: "Link de redirecionamento inválido.",
        };
      }
      invalidateLists();
      form.reset();
      return { success: true, redirectUrl };
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
