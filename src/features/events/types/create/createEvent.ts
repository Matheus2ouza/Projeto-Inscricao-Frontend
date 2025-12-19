export type { CreateEventFormType } from "../../schema/create/CreateEventSchema";
export type StatusEvent = "OPEN" | "CLOSE" | "FINALIZED";

export type CreateEventResponsible = {
  accountId: string;
};

export type CreateEventRequest = {
  name: string;
  startDate: Date;
  endDate: Date;
  regionId: string;
  image?: string;
  location?: string;
  longitude?: number;
  latitude?: number;
  status: StatusEvent;
  paymentEnabled: boolean;
  responsibles?: CreateEventResponsible[];
};

export type RegisterEventResponse = {
  id: string;
};
