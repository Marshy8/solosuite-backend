import { TimeBoundary } from "./timeBoundary.type";

export type TimeOff = {
  summary: string;
  start: TimeBoundary;
  end: TimeBoundary;
};
