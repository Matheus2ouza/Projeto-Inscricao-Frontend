'use client';

import BackgroundPaths from '@/features/guest/components/guestInscription/background-paths';
import { RegisterGuest } from '@/features/guest/components/guestInscription/RegisterGuest';
import { useDetailsEvent } from '@/features/guest/hook/guestInscription/useDetailsEvent';
import { useImagePalette } from '@/features/guest/hook/guestInscription/useImagePalette';
import PageContainer from '@/shared/components/layout/PageContainer';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { useParams, useRouter } from 'next/navigation';

export default function RegisterGuestInscription() {
  const router = useRouter();
  const params = useParams();
  const rawEventId = params.eventId;
  const eventId = Array.isArray(rawEventId) ? rawEventId[0] : rawEventId;

  const { event, loading, error, refetch } = useDetailsEvent({
    eventId: eventId ?? '',
  });

  const { palette, isDark, swatches, ready } = useImagePalette(event?.imageUrl);

  const preferredSwatch =
    (isDark ? swatches.DarkVibrant : swatches.LightVibrant) ??
    swatches.Vibrant ??
    swatches.Muted ??
    swatches.DarkMuted ??
    swatches.LightMuted;

  const titleColor =
    preferredSwatch?.titleTextColor ?? (isDark ? '#ffffff' : '#111111');
  const bodyColor =
    preferredSwatch?.bodyTextColor ??
    (isDark ? 'rgba(255,255,255,0.7)' : '#374151');

  if (!eventId) {
    return null;
  }

  const handleViewInscription = () => {
    router.push(`/guest/${eventId}/inscription?scroll=payment`);
  };

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
            <div className="border-border space-y-3 border-t pt-4">
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
    if (loading || !ready) {
      return renderSkeletonGrid();
    }

    if (error) {
      return (
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-center">
            <p className="text-foreground mb-4">{error}</p>
            <Button onClick={() => refetch()}>Tentar Novamente</Button>
          </div>
        </div>
      );
    }

    return (
      <RegisterGuest
        event={event}
        palette={palette}
        isDark={isDark}
        swatches={swatches}
        onViewInscription={handleViewInscription}
      />
    );
  };

  const handleBack = () => {
    router.replace(`/events/${eventId}`);
  };

  return (
    <div className="relative isolate min-h-screen">
      <BackgroundPaths palette={palette} />

      <PageContainer
        title="Registro de Inscrição"
        description="Registre sua inscrição abaixo"
        className="bg-transparent bg-none"
        titleColor={titleColor}
        descriptionColor={bodyColor}
        backButtonAction={handleBack}
      >
        {renderContent()}
      </PageContainer>
    </div>
  );
}
