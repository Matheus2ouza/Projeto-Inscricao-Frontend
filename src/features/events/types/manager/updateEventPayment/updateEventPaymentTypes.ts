export type UpdateEventPaymentInput = {
  eventId: string;
  paymentEnabled: boolean;
};

export type UpdateEventPaymentResponse = {
  id: string;
  paymentStatus: boolean;
};
