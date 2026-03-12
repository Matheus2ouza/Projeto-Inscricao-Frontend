import { useGlobalLoading } from "@/components/GlobalLoading";
import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import { useForm } from "react-hook-form";
import { createMember } from "../../api/createMember";
import { membersSchema, MembersSchemaType } from "../../schema/membersSchema";
import { useInvalidateMembersQuery } from "../useMembersQuery";

export type UseFormCreateMembers = {
  form: ReturnType<typeof useForm<MembersSchemaType>>;
  onSubmit: (event?: React.BaseSyntheticEvent) => Promise<{
    success: boolean;
    error?: string;
  }>;
};

export default function useFormCreateMember(): UseFormCreateMembers {
  const { setLoading } = useGlobalLoading();
  const { invalidateLists } = useInvalidateMembersQuery();

  // Data de hoje no formato YYYY-MM-DD
  const today = dayjs().format("YYYY-MM-DD");

  const form = useForm<MembersSchemaType>({
    resolver: zodResolver(membersSchema),
    defaultValues: {
      name: "",
      birthDate: today, // Data de hoje como padrão
      gender: "MASCULINO",
      cpf: "",
      preferredName: "",
      shirtSize: "M",
      shirtType: "TRADICIONAL",
    },
  });

  async function onSubmit(event?: React.BaseSyntheticEvent) {
    // Previna comportamento padrão do form
    if (event?.preventDefault) event.preventDefault();

    const values = form.getValues();

    setLoading(true);
    try {
      await createMember(values); // Cria no backend
      invalidateLists(); // Invalida cache
      form.reset(); // Reseta o form
      return { success: true };
    } catch (error) {
      const err = error as Error;
      return { success: false, error: err.message };
    } finally {
      setLoading(false); // Desliga loading
    }
  }

  return {
    form,
    onSubmit,
  };
}
