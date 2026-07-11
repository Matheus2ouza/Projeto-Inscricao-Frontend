'use client';

import { RegisterExclusiveInscription } from '@/features/inscriptions/components/exclusiveInscriptionLink/registerInscriptionLink/RegisterExclusiveInscription';
import { useValidateExclusiveInscriptionLink } from '@/features/inscriptions/hooks/exclusiveInscriptionLink/validateExclusiveInscriptionLink/useValidateExclusiveInscriptionLink';
import BackgroundPaths from '@/shared/components/BackgroundPaths';
import PageContainer from '@/shared/components/layout/PageContainer';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { useImagePalette } from '@/shared/hooks/useImagePalette';
import { useParams, useRouter } from 'next/navigation';

export default function RegisterExclusiveInscriptionPage() {
  const router = useRouter();
  const params = useParams();
  const rawToken = params.token;
  const token = Array.isArray(rawToken) ? rawToken[0] : rawToken;

  const {
    event,
    exclusiveInscriptionLink,
    status,
    canInscribe,
    loading,
    error,
    refresh,
  } = useValidateExclusiveInscriptionLink(token || '');
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

  const handleViewInscription = () => {
    if (!event?.id) return;
    router.push(`/guest/${event.id}/inscription`);
  };

  const handleBack = () => {
    router.replace(`/exclusive/${token}`);
  };

  const renderSkeletonContent = () => {
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
      </div>
    );
  };

  const renderContent = () => {
    if (loading || !ready) {
      return renderSkeletonContent();
    }

    if (error || !exclusiveInscriptionLink || !event) {
      return (
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-center">
            <h1 className="mb-4 text-2xl font-bold">Link Inválido</h1>
            <p className="mb-4">
              Este link de inscrição não é válido ou expirou.
            </p>
            <button
              onClick={() => refresh()}
              className="bg-primary hover:bg-primary/90 rounded px-4 py-2 text-white"
            >
              Tentar Novamente
            </button>
          </div>
        </div>
      );
    }

    return (
      <RegisterExclusiveInscription
        token={token ?? ''}
        event={event}
        exclusiveInscriptionLink={exclusiveInscriptionLink}
        status={status}
        canInscribe={canInscribe}
        palette={palette}
        isDark={isDark}
        swatches={swatches}
        onViewInscription={handleViewInscription}
      />
    );
  };

  return (
    <div className="relative isolate min-h-screen">
      <BackgroundPaths palette={palette} />
      <PageContainer
        title={event?.name.toUpperCase() ?? 'Inscrição Exclusiva'}
        description={event?.location ?? ''}
        showTitle={!!event?.name}
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
