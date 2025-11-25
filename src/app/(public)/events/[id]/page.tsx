"use client";

import PublicEventDetails from "@/features/events/components/PublicEventDetails";
import { usePublicEvent } from "@/features/events/hooks/usePublicEvent";
import PageContainer from "@/shared/components/layout/PageContainer";
import { Button } from "@/shared/components/ui/button";
import { Skeleton } from "@heroui/react";
import { useParams, useRouter } from "next/navigation";
import { useMemo } from "react";

export default function EventPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = useMemo(() => {
    const raw = params.id;
    return Array.isArray(raw) ? raw[0] : raw;
  }, [params.id]);

  const { event, loading, error, refetch } = usePublicEvent(eventId as string);

  const title = event?.name ?? "Evento";
  const description = event
    ? `${event.regionName}`
    : loading
      ? "Carregando evento"
      : (error ?? "");

  const handleSubscribe = () => {
    router.push("/login");
  };

  return (
    <PageContainer title={title} description={description}>
      {loading ? (
        <div className="space-y-6">
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
      ) : error ? (
        <div className="min-h-[400px] flex items-center justify-center">
          <div className="text-center">
            <p className="mb-4 text-foreground">{error}</p>
            <Button onClick={() => refetch()}>Tentar Novamente</Button>
          </div>
        </div>
      ) : (
        <PublicEventDetails event={event} onSubscribe={handleSubscribe} />
      )}
    </PageContainer>
  );
}
