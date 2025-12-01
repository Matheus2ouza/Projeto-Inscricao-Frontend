export type EventsForPayments = {
  id: string;
  name: string;
  imageUrl?: string;
  status: string;
  totalPayments: number;
  totalDebt: number;
}[];

export type FindAllWithPaymentsOutput = {
  events: EventsForPayments;
  total: number;
  page: number;
  pageCount: number;
};
