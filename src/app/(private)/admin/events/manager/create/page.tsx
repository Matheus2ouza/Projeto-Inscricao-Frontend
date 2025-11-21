"use client";

import RegisterFormEvent from "@/features/events/components/RegisterFormEvent";
import PageContainer from "@/shared/components/layout/PageContainer";
import { useRouter } from "next/navigation";

export default function CreateEventAdminPage() {
  const router = useRouter();
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
      <RegisterFormEvent roleSegment="admin" />
    </PageContainer>
  );
}
