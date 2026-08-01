import { TimeBoundary } from "../../../types/timeBoundary.type";

export function dbTimeToTimeBoundary(time: string | null, timeZone: string) {
  if (time == null) {
    return null;
  } else {
    const timeBoundary: TimeBoundary = {
      kind: "specificTime",
      dateTime: time,
      timeZone,
    };
    return timeBoundary;
  }
}
