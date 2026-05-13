'use client';

import ListExclusiveInscriptionLink from '@/features/inscriptions/components/exclusiveInscriptionLink/ListExclusiveInscriptionLink';
import { useListExclusiveInscriptionLink } from '@/features/inscriptions/hooks/exclusiveInscriptionLink/useListExclusiveInscriptionLink';
import PageContainer from '@/shared/components/layout/PageContainer';
import { Button } from '@/shared/components/ui/button';
import { useParams, useRouter } from 'next/navigation';

const PAGE_SIZE = 5;

export default function ExclusiveInscriptionLinkPage() {
  const params = useParams();
  const router = useRouter();
  const rawEventId = params.eventId;
  const eventId = Array.isArray(rawEventId) ? rawEventId[0] : rawEventId;

  const {
    event,
    exclusiveInscriptionLinks,
    total,
    page,
    pageCount,
    loading,
    fetching,
    fetched,
    error,
    setPage,
    refresh,
  } = useListExclusiveInscriptionLink({
    eventId,
    initialPage: 1,
    pageSize: PAGE_SIZE,
  });

  const handleBack = () => {
    router.back();
  };

  const createLink = () => {
    router.push(
      `/admin/inscriptions/exclusive-inscription-link/${eventId}/create`,
    );
  };

  const renderSkeletonGrid = () => {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="glass-surface overflow-hidden rounded-xl">
          <div className="p-6">
            <div className="flex flex-col gap-6 sm:flex-row">
              <div className="bg-muted relative h-48 w-full flex-shrink-0 animate-pulse overflow-hidden rounded-lg sm:w-70">
                <div className="bg-muted flex h-full w-full items-center justify-center">
                  <div className="h-12 w-12 rounded bg-gray-300"></div>
                </div>
              </div>

              <div className="flex-1 space-y-4">
                <div className="space-y-3">
                  <div className="h-8 w-3/4 animate-pulse rounded bg-gray-300"></div>
                  <div className="h-4 w-1/2 animate-pulse rounded bg-gray-300"></div>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div
                      key={index}
                      className="glass-surface-strong animate-pulse rounded-lg p-4"
                    >
                      <div className="space-y-2">
                        <div className="h-4 w-2/3 rounded bg-gray-300"></div>
                        <div className="h-7 w-1/3 rounded bg-gray-300"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Links List Skeleton */}
        <div className="glass-surface overflow-hidden rounded-xl">
          <div className="space-y-4 p-6">
            <div className="flex items-center justify-between">
              <div className="h-7 w-48 animate-pulse rounded bg-gray-300"></div>
              <div className="h-10 w-32 animate-pulse rounded bg-gray-300"></div>
            </div>
          </div>

          <div className="px-6 pb-6">
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, index) => (
                <div
                  key={index}
                  className="glass-surface animate-pulse rounded-lg p-4"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <div className="h-4 w-16 rounded bg-gray-300"></div>
                    <div className="h-8 w-8 rounded bg-gray-300"></div>
                  </div>

                  <div className="mb-3">
                    <div className="h-4 w-full rounded bg-gray-300"></div>
                  </div>

                  <div className="mb-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="space-y-2">
                      <div className="h-3 w-20 rounded bg-gray-300"></div>
                      <div className="h-4 w-24 rounded bg-gray-300"></div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-3 w-16 rounded bg-gray-300"></div>
                      <div className="h-4 w-28 rounded bg-gray-300"></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="h-3 w-20 rounded bg-gray-300"></div>
                      <div className="h-6 w-12 rounded bg-gray-300"></div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-3 w-20 rounded bg-gray-300"></div>
                      <div className="h-6 w-16 rounded bg-gray-300"></div>
                    </div>
                  </div>
                </div>
              ))}
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
        <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
          <div>
            <p className="font-semibold text-red-600 dark:text-red-400">
              Não foi possível carregar os links.
            </p>
            <p className="text-muted-foreground mt-1 max-w-md">
              {error.message || 'Tente novamente em instantes.'}
            </p>
          </div>
          <Button onClick={() => refresh()} variant="outline">
            Tentar novamente
          </Button>
        </div>
      );
    }

    return (
      <ListExclusiveInscriptionLink
        pageSize={PAGE_SIZE}
        event={event}
        exclusiveInscriptionLinks={exclusiveInscriptionLinks}
        total={total}
        page={page}
        pageCount={pageCount}
        loadingExclusiveInscriptionLinks={fetching}
        onPageChange={setPage}
        onCreateLink={() => {
          createLink();
        }}
      />
    );
  };

  const getPageTitle = () => {
    if (loading) {
      return 'Carregando...';
    }

    if (error) {
      return 'Links de Inscrição Exclusivos';
    }

    if (event?.name) {
      return `${event.name} - Links Exclusivos`;
    }

    return 'Links de Inscrição Exclusivos';
  };

  const getPageDescription = () => {
    if (loading) {
      return 'Carregando...';
    }

    if (error) {
      return 'Não foi possível carregar os links exclusivos deste evento.';
    }

    if (event?.name) {
      return `Gerencie os links de inscrição exclusivos para o evento ${event.name}`;
    }

    return 'Gerencie os links de inscrição exclusivos para este evento.';
  };

  return (
    <PageContainer
      title={getPageTitle()}
      description={getPageDescription()}
      showBackButton
      backButtonAction={handleBack}
    >
      {renderContent()}
    </PageContainer>
  );
}
