"use client";

import RegisterPaymentCardPublicTable from "@/features/payment/components/registerPaymentPublic/RegisterPaymentCardPublicTable";
import { useRegisterPaymentPublic } from "@/features/payment/hook/registerPaymentPublic/useRegisterPaymentPublic";
import PageContainer from "@/shared/components/layout/PageContainer";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";

export default function RegisterPaymentCardPublicPage() {
  const searchParams = useSearchParams();
  const eventId = searchParams.get("eventId") || "";
  const inscriptionIds = searchParams.get("inscriptions")?.split(",") || [];
  const userId = searchParams.get("userId") || "";
  const totalValue = Number(searchParams.get("totalValue")) || 0;

  const { event, loading, error, refresh } = useRegisterPaymentPublic({
    eventId,
  });

  const renderSkeletonGrid = () => {
    return (
      <div className="p-6 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 p-4 bg-muted/30 rounded-lg border">
          <div className="space-y-1">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-60" />
          </div>
          <Skeleton className="h-10 w-40" />
        </div>
        <Skeleton className="h-[420px] w-full" />
      </div>
    );
  };

  const renderContent = () => {
    if (loading) {
      return renderSkeletonGrid();
    }

    if (error) {
      return (
        <div className="p-6 flex items-center justify-center min-h-96">
          <div className="text-red-500">
            <AlertCircle className="h-12 w-12 inline-block mr-2" />
            <span>Erro ao carregar o evento.</span>
          </div>
        </div>
      );
    }

    return (
      <RegisterPaymentCardPublicTable
        event={event}
        eventId={eventId}
        inscriptionsIds={inscriptionIds}
        userId={userId}
        totalValue={totalValue}
      />
    );
  };

  return (
    <PageContainer
      title="Detalhes do Pagamento"
      description="Visualize os detalhes do pagamento"
      showBackButton={true}
    >
      {renderContent()}
    </PageContainer>
  );
}
