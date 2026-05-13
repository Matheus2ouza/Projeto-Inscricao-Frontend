'use client';

import PublicEventDetails from '@/features/events/components/publicEvents/PublicEventDetails';
import { usePublicEvent } from '@/features/events/hooks/publicEvents/usePublicEvent';
import BackgroundPaths from '@/features/guest/components/guestInscription/background-paths';
import { useImagePalette } from '@/features/guest/hook/guestInscription/useImagePalette';
import PageContainer from '@/shared/components/layout/PageContainer';
import { Button } from '@/shared/components/ui/button';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { useParams, useRouter } from 'next/navigation';

export default function EventPage() {
  const router = useRouter();
  const params = useParams();
  const rawEventId = params.eventId;
  const eventId = Array.isArray(rawEventId) ? rawEventId[0] : rawEventId;

  if (!eventId) {
    return null;
  }

  const { event, loading, error, refetch } = usePublicEvent({ eventId });

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

  const handleViewSubscription = (eventId: string) => {
    router.push(`/guest/${eventId}/inscription`);
  };

  const handleSubscribe = (eventId: string) => {
    router.push(`/guest/${eventId}`);
  };

  const handleLogin = () => {
    router.push('/login');
  };

  const renderSkeletonGrid = () => {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-10 w-1/3" />
          <Skeleton className="h-5 w-1/4" />
        </div>

        <div className="relative overflow-hidden rounded-xl">
          <div className="relative aspect-[3/2] max-h-[400px] w-full overflow-hidden">
            <Skeleton className="h-full w-full" />
          </div>
        </div>

        <div className="mb-6 flex flex-col gap-3 sm:flex-row">
          <Skeleton className="h-12 w-full sm:w-40" />
          <Skeleton className="h-12 w-full sm:w-40" />
          <Skeleton className="h-12 w-full sm:w-40" />
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="bg-card rounded-lg border p-6">
              <div className="flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-6 w-40" />
                </div>
              </div>
            </div>
            <div className="bg-card rounded-lg border p-6">
              <div className="flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-6 w-40" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg border p-6">
            <div className="space-y-6">
              <div className="space-y-2">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-5 w-64" />
              </div>
              <div className="h-64 overflow-hidden rounded-lg border">
                <Skeleton className="h-full w-full" />
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg border p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex-1 space-y-2">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-5 w-48" />
              </div>
              <Skeleton className="h-12 w-full sm:w-40" />
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    if (loading) {
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
      <PublicEventDetails
        palette={palette}
        isDark={isDark}
        swatches={swatches}
        event={event}
        onViewSubscription={handleViewSubscription}
        onSubscribe={handleSubscribe}
        onLogin={handleLogin}
      />
    );
  };

  return (
    <div className="relative isolate min-h-screen">
      <BackgroundPaths palette={palette} />
      <PageContainer
        title={event?.name.toUpperCase() ?? 'Evento'}
        description={event?.regionName ?? ''}
        showTitle={!loading}
        className="bg-transparent bg-none"
        titleColor={titleColor}
        descriptionColor={bodyColor}
      >
        {renderContent()}
      </PageContainer>
    </div>
  );
}
