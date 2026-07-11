export type FindPaymentsDateResponse = {
  eventId: string;
  paymentId: string;
  installmentNumber: number;
  received: boolean;
  value: number;
  netValue: number;
  estimatedAt: string;
}[];

export type PaymentsDates = {
  eventId: string;
  paymentId: string;
  installmentNumber: number;
  received: boolean;
  value: number;
  netValue: number;
  estimatedAt: string;
};
