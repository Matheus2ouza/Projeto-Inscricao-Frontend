export type Event = {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  imageUrl?: string;
};

export type RegisterPaymentPublicParams = {
  eventId: string;
};

export type RegisterPaymentPublicResult = {
  event: Event | null;
  loading: boolean;
  error: Error | null;
  refresh: () => void;
};
