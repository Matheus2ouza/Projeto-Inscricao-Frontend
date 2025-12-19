"use client";

import RegisterFormEvent from "@/features/events/components/create/RegisterFormEvent";
import PageContainer from "@/shared/components/layout/PageContainer";
import { useCurrentUser } from "@/shared/context/user-context";
import { useRouter } from "next/navigation";

export default function CreateEventAdminPage() {
  const router = useRouter();
  const { user } = useCurrentUser();
  const handleBack = () => {
    router.replace("/admin/events/manager");
  };

  return (
    <PageContainer
      title="Criar Novo Evento"
      description="Preencha as informações para publicar um novo evento."
      showBackButton={true}
      backButtonAction={handleBack}
    >
      <RegisterFormEvent
        roleSegment={user.role as "SUPER" | "ADMIN" | "MANAGER"}
        onSubmitSuccess={handleBack}
      />
    </PageContainer>
  );
}
