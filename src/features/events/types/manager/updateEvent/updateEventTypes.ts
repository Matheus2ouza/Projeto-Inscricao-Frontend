export type UpdateEventInput = {
  name: string;
  startDate: string | Date;
  endDate: string | Date;
  location?: string;
  longitude?: number | null;
  latitude?: number | null;
};

export type UpdateEventResponse = {
  id: string;
};
