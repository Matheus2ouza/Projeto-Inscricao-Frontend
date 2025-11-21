"use client";

import InscriptionsByEventTable from "@/features/inscriptions/components/InscriptionsByEventTable";
import { useInscriptions } from "@/features/inscriptions/hooks/useInscriptions";
import PageContainer from "@/shared/components/layout/PageContainer";
import { useParams, useRouter } from "next/navigation";

export default function MyInscriptions() {
  const router = useRouter();
  const params = useParams();
  const eventId = params.eventId as string;
  const { events, total, page, pageCount, error, setPage, refetch } =
    useInscriptions({
      pageSize: 10,
    });

  const handleBack = () => {
    router.push(`/user/home`);
  };

  return (
    <PageContainer
      title="Minhas Inscrições"
      description="Visualize todas as suas inscrições nos eventos"
      showBackButton={true}
      backButtonAction={handleBack}
    >
      <InscriptionsByEventTable
        events={events}
        total={total}
        page={page}
        pageCount={pageCount}
        error={error}
        setPage={setPage}
        refetch={refetch}
      />
    </PageContainer>
  );
}
