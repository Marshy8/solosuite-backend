import { TimeBoundary } from "../../../types/timeBoundary.type";

export function dbTimeToTimeBoundary(time: string | null) {
  if (time == null) {
    return null;
  } else {
    const timeBoundary: TimeBoundary = {
      kind: "specificTime",
      dateTime: time,
      timeZone: "America/New_York",
    };
    return timeBoundary;
  }
}
