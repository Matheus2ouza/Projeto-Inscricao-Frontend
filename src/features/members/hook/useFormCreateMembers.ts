import { useGlobalLoading } from "@/components/GlobalLoading";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { createMember } from "../api/createMember";
import { membersSchema, MembersSchemaType } from "../schema/membersSchema";
import { useInvalidateMembersQuery } from "./useMembersQuery";

export type UseFormCreateMembers = {
  form: ReturnType<typeof useForm<MembersSchemaType>>;
  onSubmit: (event?: React.BaseSyntheticEvent) => Promise<{
    success: boolean;
    error?: string;
  }>;
};

export default function useFormCreateMembers(): UseFormCreateMembers {
  const { setLoading } = useGlobalLoading();
  const { invalidateLists } = useInvalidateMembersQuery();

  const form = useForm<MembersSchemaType>({
    resolver: zodResolver(membersSchema),
    defaultValues: {
      name: "",
      birthDate: "",
      gender: "MASCULINO",
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
