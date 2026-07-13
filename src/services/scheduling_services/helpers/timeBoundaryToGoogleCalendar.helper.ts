import { calendar_v3 } from "googleapis";
import { TimeBoundary } from "../../../types/timeBoundary.type";

export function timeBoundaryToGoogleCalendar(
  timeBoundary: TimeBoundary,
): calendar_v3.Schema$EventDateTime {
  if (timeBoundary.kind === "fullDay") {
    return { date: timeBoundary.date };
  } else {
    return { dateTime: timeBoundary.dateTime, timeZone: timeBoundary.timeZone };
  }
}
