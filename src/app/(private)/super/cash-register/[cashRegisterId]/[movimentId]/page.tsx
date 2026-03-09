"use client";

import MovimentDetailsContent from "@/features/cashRegister/components/movimentDetails/MovimentDetails";
import { useMovimentDetails } from "@/features/cashRegister/hook/movimentDetails/useMovimentDetails";
import PageContainer from "@/shared/components/layout/PageContainer";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { useCurrentUser } from "@/shared/context/user-context";
import { useParams, useRouter } from "next/navigation";

export default function MovimentDetailSuperPage() {
  const { user } = useCurrentUser();
  const params = useParams();
  const router = useRouter();
  const rawCashRegisterId = params.cashRegisterId;
  const cashRegisterId = Array.isArray(rawCashRegisterId)
    ? rawCashRegisterId[0]
    : rawCashRegisterId;
  const rawMovimentId = params.movimentId;
  const movimentId = Array.isArray(rawMovimentId)
    ? rawMovimentId[0]
    : rawMovimentId;

  if (!cashRegisterId) {
    return null;
  }

  if (!movimentId) {
    return null;
  }

  const {
    movimentDetails,
    reference,
    referenceId,
    loading,
    fetching,
    error,
    refetch,
  } = useMovimentDetails({ movimentId });

  const renderSkeletonGrid = () => {
    return (
      <Card className="border-0 shadow-sm">
        <CardContent className="space-y-4">
          <Skeleton className="h-10 w-2/5" />
          <Skeleton className="h-72" />
          <Skeleton className="h-12" />
        </CardContent>
      </Card>
    );
  };

  const renderContent = () => {
    if (loading) {
      return renderSkeletonGrid();
    }

    if (error) {
      return (
        <div className="p-6 flex items-center justify-center min-h-96">
          <div className="text-center text-destructive">
            <p className="mb-4">
              Erro ao carregar detalhes do pagamento: {error}
            </p>
            <Button onClick={refetch}>Tentar Novamente</Button>
          </div>
        </div>
      );
    }

    return (
      <MovimentDetailsContent
        movimentDetails={movimentDetails}
        reference={reference}
        referenceId={referenceId}
      />
    );
  };

  const handleBack = () => {
    router.replace(`/admin/cash-register/${cashRegisterId}`);
  };

  return (
    <PageContainer
      title="Detalhes do Movimento"
      description={
        fetching ? "Carregando..." : movimentDetails?.id || "Movimento"
      }
      showBackButton
      backButtonAction={handleBack}
    >
      {renderContent()}
    </PageContainer>
  );
}
