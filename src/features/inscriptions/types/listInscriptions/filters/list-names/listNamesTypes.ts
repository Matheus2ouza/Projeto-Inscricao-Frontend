export type ListNamesInput = {
  eventId: string;
};

export type ListNamesResponse = {
  id: string;
  name: string;
}[];

export type ListNames = {
  id: string;
  name: string;
}[];

export type ListNamesParam = {
  eventId: string;
};

export type ListNamesResult = {
  listNames: ListNames;
  loading: boolean;
  error: Error | null;
  refresh: () => void;
};
