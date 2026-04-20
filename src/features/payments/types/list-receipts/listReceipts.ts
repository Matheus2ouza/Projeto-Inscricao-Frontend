export type Receipt = {
  id: string;
  status: string;
  totalValue: number;
  createdAt: string | Date;
  imageUrl: string;
};

export type ListReceiptsResponse = {
  receipts: Receipt[];
  total: number;
  page: number;
  pageCount: number;
};

export type UseListReceiptsParams = {
  eventId: string;
  initialPage: number;
  pageSize: number;
};

export type UseListReceiptsResult = {
  receipts: Receipt[];
  total: number;
  page: number;
  pageCount: number;
  loading: boolean;
  fetching: boolean;
  fetched: boolean;
  error: Error | null;
  setPage: (page: number) => void;
  refresh: () => void;
};
