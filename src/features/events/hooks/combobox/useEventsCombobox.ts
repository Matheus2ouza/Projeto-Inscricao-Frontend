"use client";

import { getEventsCombobox } from "@/features/events/api/combobox/getEventsCombobox";
import { Event } from "@/features/events/types/combobox/comboboxEventTypes";
import { useEffect, useState } from "react";

type UseEventsResult = {
  events: Event[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
};

export function useEventsCombobox(): UseEventsResult {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getEventsCombobox();
      console.log(data);
      setEvents(data.event);
    } catch (e: unknown) {
      const errorMessage =
        e instanceof Error ? e.message : "Falha ao carregar os eventos";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return { events, loading, error, refetch: fetchEvents };
}
