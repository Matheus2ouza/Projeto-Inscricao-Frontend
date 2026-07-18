'use client';

import {
  UseEventDetailsToGuestInscriptionParams,
  UseEventDetailsToGuestInscriptionResult,
} from '@/features/guest/types/guestInscription/eventDetailsToGuestInscriptionTypes';
import { useEventDetailsToGuestInscriptionQuery } from './useEventDetailsToGuestInscriptionQuery';

export function useEventDetailsToGuestInscription({
  eventId,
}: UseEventDetailsToGuestInscriptionParams): UseEventDetailsToGuestInscriptionResult {
  const { data, isLoading, error, refetch } =
    useEventDetailsToGuestInscriptionQuery(eventId);

  return {
    event: data || null,
    loading: isLoading,
    error: error || null,
    refetch: async () => {
      await refetch();
    },
  };
}
