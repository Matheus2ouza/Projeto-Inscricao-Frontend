export type Region = {
  id: string;
  name: string;
};

export type ListRegionsResponse = Region[];

export type UseListRegionsResult = {
  regions: Region[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
};
