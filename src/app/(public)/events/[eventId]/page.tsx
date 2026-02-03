"use client";

import PublicEventDetails from "@/features/events/components/publicEvents/PublicEventDetails";
import { usePublicEvent } from "@/features/events/hooks/publicEvents/usePublicEvent";
import PageContainer from "@/shared/components/layout/PageContainer";
import { Button } from "@/shared/components/ui/button";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { useParams, useRouter } from "next/navigation";

export default function EventPage() {
  const router = useRouter();
  const params = useParams();
  const rawEventId = params.eventId;
  const eventId = Array.isArray(rawEventId) ? rawEventId[0] : rawEventId;

  if (!eventId) {
    return null;
  }

  const { event, loading, error, refetch } = usePublicEvent({ eventId });

  const handleViewSubscription = (eventId: string) => {
    router.push(`/guest/${eventId}/inscription`);
  };

  const handleSubscribe = (eventId: string) => {
    router.push(`/guest/${eventId}`);
  };

  const handleLogin = () => {
    router.push("/login");
  };

  const renderSkeletonGrid = () => {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-10 w-1/3" />
          <Skeleton className="h-5 w-1/4" />
        </div>

        <div className="relative rounded-xl overflow-hidden">
          <div className="relative w-full max-h-[400px] aspect-[3/2] overflow-hidden">
            <Skeleton className="w-full h-full" />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <Skeleton className="h-12 w-full sm:w-40" />
          <Skeleton className="h-12 w-full sm:w-40" />
          <Skeleton className="h-12 w-full sm:w-40" />
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="border rounded-lg p-6 bg-card">
              <div className="flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-6 w-40" />
                </div>
              </div>
            </div>
            <div className="border rounded-lg p-6 bg-card">
              <div className="flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-6 w-40" />
                </div>
              </div>
            </div>
          </div>

          <div className="border rounded-lg p-6 bg-card">
            <div className="space-y-6">
              <div className="space-y-2">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-5 w-64" />
              </div>
              <div className="h-64 rounded-lg overflow-hidden border">
                <Skeleton className="w-full h-full" />
              </div>
            </div>
          </div>

          <div className="border rounded-lg p-6 bg-card">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
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
        <div className="min-h-[400px] flex items-center justify-center">
          <div className="text-center">
            <p className="mb-4 text-foreground">{error}</p>
            <Button onClick={() => refetch()}>Tentar Novamente</Button>
          </div>
        </div>
      );
    }

    return (
      <PublicEventDetails
        event={event}
        onViewSubscription={handleViewSubscription}
        onSubscribe={handleSubscribe}
        onLogin={handleLogin}
      />
    );
  };

  return (
    <PageContainer
      title={event?.name.toUpperCase() ?? "Evento"}
      description={event?.regionName ?? ""}
      showTitle={!loading}
    >
      {renderContent()}
    </PageContainer>
  );
}
