import { addMinutes } from "date-fns";
import { TimeChunk } from "../../../types/timeChunk.type";

export function padIntervalEnd(
  interval: TimeChunk,
  bufferMinutes: number,
): TimeChunk {
  const paddedIntervalEnd = addMinutes(interval.end, bufferMinutes);

  const paddedInterval: TimeChunk = {
    start: interval.start,
    end: paddedIntervalEnd,
  };

  return paddedInterval;
}
