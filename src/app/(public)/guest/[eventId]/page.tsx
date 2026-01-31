"use client";

import { RegisterGuest } from "@/features/guest/components/guestInscription/RegisterGuest";
import { useDetailsEvent } from "@/features/guest/hook/guestInscription/useDetailsEvent";
import PageContainer from "@/shared/components/layout/PageContainer";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { useParams, useRouter } from "next/navigation";

export default function RegisterGuestInscription() {
  const router = useRouter();
  const params = useParams();
  const rawEventId = params.eventId;
  const eventId = Array.isArray(rawEventId) ? rawEventId[0] : rawEventId;

  if (!eventId) {
    return null;
  }

  const { event, loading, error, refetch } = useDetailsEvent({ eventId });

  const renderSkeletonGrid = () => {
    return (
      <Card className="border-0 shadow-sm">
        <CardContent className="p-6">
          <div className="space-y-8">
            <div className="flex flex-col gap-6 lg:flex-row">
              {/* Skeleton da Imagem */}
              <div className="w-full lg:w-1/3">
                <Skeleton className="h-64 w-full rounded-lg" />
              </div>

              {/* Skeleton das Informações */}
              <div className="flex-1 space-y-4">
                <Skeleton className="h-9 w-3/4" /> {/* Título */}
                <div className="flex flex-wrap items-center gap-4">
                  <Skeleton className="h-4 w-32" /> {/* Data Início */}
                  <Skeleton className="h-4 w-32" /> {/* Data Fim */}
                </div>
              </div>
            </div>

            {/* Skeleton Tipos de Inscrição */}
            <div className="space-y-3">
              <Skeleton className="h-6 w-40" /> {/* Título Tipos */}
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <Skeleton className="h-28 rounded-lg" />
                <Skeleton className="h-28 rounded-lg" />
                <Skeleton className="h-28 rounded-lg" />
                <Skeleton className="h-28 rounded-lg" />
              </div>
            </div>

            {/* Skeleton Informações Adicionais */}
            <div className="pt-4 border-t border-border space-y-3">
              <Skeleton className="h-5 w-48" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-4/6" />
              </div>
            </div>
          </div>
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
        <div className="min-h-[400px] flex items-center justify-center">
          <div className="text-center">
            <p className="mb-4 text-foreground">{error}</p>
            <Button onClick={() => refetch()}>Tentar Novamente</Button>
          </div>
        </div>
      );
    }

    return <RegisterGuest event={event} />;
  };

  return (
    <PageContainer
      title="Registro de Inscrição"
      description="Registre sua inscrição abaixo"
    >
      {renderContent()}
    </PageContainer>
  );
}
