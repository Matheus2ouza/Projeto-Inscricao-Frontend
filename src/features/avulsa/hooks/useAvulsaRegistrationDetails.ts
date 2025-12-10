"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getAvulsaRegistrationDetails } from "../api/getAvulsaRegistrationDetails";
import {
  GetAvulsaRegistrationDetailsRequest,
  avulsaKeys,
} from "../types/avulsaTypes";

const STALE_TIME = 5 * 60 * 1000;
const GC_TIME = 10 * 60 * 1000;

export function useAvulsaRegistrationDetails({
  eventId,
  registrationId,
}: GetAvulsaRegistrationDetailsRequest) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: avulsaKeys.detail(eventId, registrationId),
    queryFn: async () => getAvulsaRegistrationDetails({ eventId, registrationId }),
    enabled: Boolean(eventId && registrationId),
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
  });

  return {
    ...query,
    invalidate: async () => {
      await queryClient.invalidateQueries({
        queryKey: avulsaKeys.detail(eventId, registrationId),
      });
    },
  };
}
