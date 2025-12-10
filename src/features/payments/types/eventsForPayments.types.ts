import { Event } from "@/features/events/types/eventTypes";

export type EventForPayments = Event & {
  totalPayments: number;
  totalDebt: number;
};

export type EventsForPayments = EventForPayments[];

export type FindAllWithPaymentsOutput = {
  events: EventsForPayments;
  total: number;
  page: number;
  pageCount: number;
};
