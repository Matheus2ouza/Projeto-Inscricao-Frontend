export enum StatusEvent {
  OPEN = "OPEN",
  CLOSE = "CLOSE",
  FINALIZED = "FINALIZED",
}

export type EventResponse = Event[];

export type Event = {
  id: string;
  name: string;
};
