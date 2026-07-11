export type FindEventDateResponse = {
  events: {
    id: string;
    name: string;
    status: string;
    startDate: string | Date;
    endDate: string | Date;
  }[];
};

export type EventsDates = {
  id: string;
  name: string;
  status: string;
  startDate: string | Date;
  endDate: string | Date;
};
