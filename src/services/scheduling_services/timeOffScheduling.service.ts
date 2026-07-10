import { calendar_v3 } from "googleapis";
import { TimeOff } from "../../types/timeOff.type";
import { TimeBoundaryToGoogleCalendar } from "./helpers/timeBoundaryToGoogleCalendar.helper";
import { createEvent } from "../google_services/googleCalendar.service";
import { deleteEvent } from "../google_services/googleCalendar.service";

export async function createTimeOff(event: TimeOff) {
  const googleEvent: calendar_v3.Schema$Event = {
    summary: event.summary,
    start: TimeBoundaryToGoogleCalendar(event.start),
    end: TimeBoundaryToGoogleCalendar(event.end),
  };

  await createEvent(googleEvent);
}

export async function deleteTimeOff(eventId: string) {
  await deleteEvent(eventId);
}
