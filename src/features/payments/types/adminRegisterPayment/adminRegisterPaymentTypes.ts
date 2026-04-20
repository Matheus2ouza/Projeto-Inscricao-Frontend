export enum StatusPayment {
  APPROVED = 'APROVADO',
  REFUSED = 'RECUSADO',
  UNDER_REVIEW = 'EM ANÁLISE',
}

export type ListInscriptionsPending = {
  id: string;
  responsible: string;
  status: StatusPayment;
  totalValue: number;
  totalPaid: number;
};

export type ListInscriptionsPendingResponse = ListInscriptionsPending;

export type ListInscriptionsPendingParams = {
  eventId: string;
};

export type UseListInscriptionsPendingResult = {
  inscriptions: ListInscriptionsPending[] | null;
  loading: boolean;
  fetching: boolean;
  fetched: boolean;
  error: Error | null;
  refresh?: () => Promise<void>;
};
