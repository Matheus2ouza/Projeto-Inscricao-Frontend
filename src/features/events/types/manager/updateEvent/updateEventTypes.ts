import type { Event } from '@/features/events/types/manager/eventDetailsManager/eventDetailsManagerTypes';

export type UpdateEventInput = {
  name?: string;
  description?: string;
  status?: string;
  startDate?: string | Date;
  endDate?: string | Date;
  // outros campos conforme necessário
};

export type UpdateEventResponse = Event;
