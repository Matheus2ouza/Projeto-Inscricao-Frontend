"use client";

import CheckInAccountDetails from "@/features/checkin/components/CheckInAccountDetails";
import { useCheckInAccountDetails } from "@/features/checkin/hooks/useCheckInAccountDetails";
import PageContainer from "@/shared/components/layout/PageContainer";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { useParams, useRouter } from "next/navigation";

export default function CheckInAccountDetailsSuperPage() {
  const params = useParams();
  const router = useRouter();
  const rawEventId = params.eventId;
  const rawAccountId = params.accountId;
  const eventId = Array.isArray(rawEventId) ? rawEventId[0] : rawEventId;
  const accountId = Array.isArray(rawAccountId)
    ? rawAccountId[0]
    : rawAccountId;

  const { data, isLoading, error, refetch } = useCheckInAccountDetails(
    eventId ?? "",
    accountId ?? ""
  );

  const handleBack = () => router.back();

  const renderLoading = () => (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-6 space-y-4">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </CardContent>
    </Card>
  );

  const renderError = () => (
    <div className="text-center py-12">
      <p className="text-red-600 font-semibold">
        {error instanceof Error
          ? error.message
          : "Não foi possível carregar os detalhes."}
      </p>
      <Button variant="outline" onClick={() => refetch()}>
        Tentar novamente
      </Button>
    </div>
  );

  return (
    <PageContainer
      title="Detalhes da Conta"
      description="Visualize os pagamentos e inscrições vinculadas"
      showBackButton
      backButtonAction={handleBack}
    >
      {isLoading && renderLoading()}
      {error && !isLoading && renderError()}
      {data && <CheckInAccountDetails account={data} />}
    </PageContainer>
  );
}
