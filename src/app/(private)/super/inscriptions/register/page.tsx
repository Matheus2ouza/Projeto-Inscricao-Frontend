"use client";

import CreateInscriptionAdmin from "@/features/inscriptions/components/inscriptionAdmin/CreateInscriptionAdmin";
import PageContainer from "@/shared/components/layout/PageContainer";
import { useRouter } from "next/navigation";

export default function RegisterInscriptionSuperPage() {
  const router = useRouter();

  const handleBack = () => {
    router.push("/super/home");
  };
  return (
    <PageContainer
      title="Registrar uma Nova Inscrição"
      description="Escolha um evento para ver todas as inscrições."
      showBackButton={true}
      backButtonAction={handleBack}
    >
      <CreateInscriptionAdmin />
    </PageContainer>
  );
}
