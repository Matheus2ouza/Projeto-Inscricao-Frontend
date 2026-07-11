export type UpdateEventInscriptionsInput = {
  eventId: string;
  status: 'OPEN' | 'CLOSE';
};

export type UpdateEventInscriptionsResponse = {
  id: string;
  InscriptionStatus: 'OPEN' | 'CLOSE';
};
