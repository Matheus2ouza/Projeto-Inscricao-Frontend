import { useGlobalLoading } from "@/components/GlobalLoading";
import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import { useForm } from "react-hook-form";
import { editMember } from "../../api/detailsMember/editMember";
import {
  detailsMemberSchema,
  DetailsMemberSchemaType,
} from "../../schema/detailsMember/detailsMemberSchema";
import { Member } from "../../types/detailsMember/detailsMemberType";
import { useInvalidateMembersQuery } from "../useMembersQuery";
import { useInvalidateDetailsMemberQuery } from "./useDetailsMemberQuery";

export type UseFormEditMember = {
  form: ReturnType<typeof useForm<DetailsMemberSchemaType>>;
  onSubmit: (event?: React.BaseSyntheticEvent) => Promise<{
    success: boolean;
    error?: string;
  }>;
};

export function useFormEditMember(member: Member): UseFormEditMember {
  const { setLoading } = useGlobalLoading();
  const { invalidateDetail } = useInvalidateDetailsMemberQuery();
  const { invalidateLists } = useInvalidateMembersQuery();

  const form = useForm<DetailsMemberSchemaType>({
    resolver: zodResolver(detailsMemberSchema),
    defaultValues: {
      name: member.name,
      birthDate: dayjs(member.birthDate).format("YYYY-MM-DD"),
      gender: member.gender,
      cpf: member.cpf,
      preferredName: member.preferredName,
      shirtSize: member.shirtSize,
      shirtType: member.shirtType,
    },
  });

  async function onSubmit(event?: React.BaseSyntheticEvent) {
    // Previna comportamento padrão do form
    if (event?.preventDefault) event.preventDefault();

    const values = form.getValues();
    setLoading(true);
    try {
      const data = await editMember(member.id, {
        name: values.name,
        preferredName: values.preferredName,
        cpf: values.cpf,
        birthDate: dayjs(values.birthDate).toDate(),
        gender: values.gender,
        shirtSize: values.shirtSize,
        shirtType: values.shirtType,
      });
      invalidateDetail(data.id);
      invalidateLists();
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
