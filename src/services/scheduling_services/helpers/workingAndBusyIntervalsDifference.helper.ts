import { Interval } from "luxon";
import { TimeChunk } from "../../../types/timeChunk.type";

export function workingAndBusyIntervalsDifference(
  workingIntervals: TimeChunk[],
  busyInterval: TimeChunk,
): TimeChunk[] {
  const busy = toInterval(busyInterval);

  return workingIntervals.flatMap((chunk) =>
    toInterval(chunk).difference(busy).map(toTimeChunk),
  );
}

function toInterval(chunk: TimeChunk): Interval {
  return Interval.fromDateTimes(chunk.start, chunk.end);
}

function toTimeChunk(interval: Interval): TimeChunk {
  return { start: interval.start!.toJSDate(), end: interval.end!.toJSDate() };
}
