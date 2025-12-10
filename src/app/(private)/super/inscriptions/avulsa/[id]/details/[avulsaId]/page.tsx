"use client";

import AvulsaRegistrationDetailsContent from "@/features/avulsa/components/AvulsaRegistrationDetailsContent";
import { useAvulsaRegistrationDetails } from "@/features/avulsa/hooks/useAvulsaRegistrationDetails";
import PageContainer from "@/shared/components/layout/PageContainer";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { useParams, useRouter } from "next/navigation";

export default function AvulsaExpensesSuperPage() {
  const params = useParams();
  const router = useRouter();
  const rawEventId = params.id;
  const rawAvulsaId = params.avulsaId;
  const eventId = Array.isArray(rawEventId) ? rawEventId[0] : rawEventId;
  const avulsaId = Array.isArray(rawAvulsaId) ? rawAvulsaId[0] : rawAvulsaId;

  if (!eventId || !avulsaId) {
    return null;
  }

  const { data, isLoading, error } = useAvulsaRegistrationDetails({
    eventId,
    registrationId: avulsaId,
  });

  const errorMessage =
    error instanceof Error
      ? error.message
      : typeof error === "string"
        ? error
        : null;

  const handleBack = () => {
    router.push(`/super/inscriptions/avulsa/${eventId}`);
  };

  const renderSkeleton = () => (
    <div className="space-y-6">
      <Card className="border-0 shadow-sm">
        <CardContent className="space-y-4">
          <Skeleton className="h-6 w-32" />
          <div className="grid gap-4 md:grid-cols-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
          <Skeleton className="h-4 w-3/4" />
        </CardContent>
      </Card>
      <div className="grid gap-4 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index} className="border-0 shadow-sm">
            <CardContent>
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-8 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
      <Card className="border-0 shadow-sm">
        <CardContent className="space-y-4">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-36 w-full" />
        </CardContent>
      </Card>
    </div>
  );

  const renderError = () => (
    <Card className="border-0 shadow-sm">
      <CardContent className="text-center text-sm text-red-600">
        {errorMessage || "Não foi possível carregar os detalhes da inscrição avulsa."}
      </CardContent>
    </Card>
  );

  return (
    <PageContainer
      title="Detalhes da Inscrição Avulsa"
      description="Informações completas sobre a inscrição selecionada."
      showBackButton
      backButtonAction={handleBack}
    >
      {isLoading && renderSkeleton()}
      {!isLoading && errorMessage && renderError()}
      {!isLoading && !errorMessage && data && (
        <AvulsaRegistrationDetailsContent data={data} />
      )}
      {!isLoading && !errorMessage && !data && renderError()}
    </PageContainer>
  );
}
