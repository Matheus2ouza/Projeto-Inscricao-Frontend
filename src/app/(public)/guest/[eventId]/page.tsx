'use client';

import { RegisterGuest } from '@/features/guest/components/guestInscription/RegisterGuest';
import { useEventDetailsToGuestInscription } from '@/features/guest/hook/guestInscription/useEventDetailsToGuestInscription';
import { useListTypeInscriptions } from '@/features/typeInscription/hook/listTypeInscriptions/useListTypeInscriptions';
import BackgroundPaths from '@/shared/components/BackgroundPaths';
import PageContainer from '@/shared/components/layout/PageContainer';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { useImagePalette } from '@/shared/hooks/useImagePalette';
import { useParams } from 'next/navigation';

export default function RegisterGuestInscription() {
  const params = useParams();
  const rawEventId = params.eventId;
  const eventId = Array.isArray(rawEventId) ? rawEventId[0] : rawEventId;

  const { event, loading, error, refetch } = useEventDetailsToGuestInscription({
    eventId,
  });

  const {
    typeInscriptions,
    loading: typeLoading,
    error: typeError,
    refresh: typeRefresh,
  } = useListTypeInscriptions({ eventId });

  const { palette, isDark, swatches, ready } = useImagePalette(event?.image);

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
    if (loading || !ready || typeLoading) {
      return renderSkeletonGrid();
    }

    if (error || typeError) {
      const errorMessage =
        error?.message ||
        typeError?.message ||
        'Erro ao carregar os dados. Tente novamente.';

      return (
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-center">
            <p className="text-foreground mb-4">{errorMessage}</p>
            <div className="flex justify-center gap-3">
              <Button
                onClick={() => {
                  if (error) refetch();
                  if (typeError) typeRefresh();
                }}
              >
                Tentar Novamente
              </Button>
            </div>
          </div>
        </div>
      );
    }

    if (!event) {
      return (
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-center">
            <p className="text-foreground mb-4">Erro ao carregar os dados</p>
            <div className="flex justify-center gap-3">
              <Button
                onClick={() => {
                  refetch();
                  typeRefresh();
                }}
              >
                Tentar Novamente
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <RegisterGuest
        event={event}
        typeInscriptions={typeInscriptions}
        palette={palette}
        isDark={isDark}
        swatches={swatches}
      />
    );
  };

  return (
    <div className="relative isolate max-h-screen w-full">
      <BackgroundPaths
        palette={palette}
        imageUrl={event?.image}
        intensity="medium"
      />

      <PageContainer
        title="Registro de Inscrição"
        description="Registre sua inscrição abaixo"
        className="bg-transparent bg-none"
        titleColor={titleColor}
        descriptionColor={bodyColor}
      >
        {renderContent()}
      </PageContainer>
    </div>
  );
}
