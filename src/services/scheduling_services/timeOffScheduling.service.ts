import { calendar_v3 } from "googleapis";
import { ScheduledTime } from "../../types/scheduledTime.type";
import { timeBoundaryToGoogleCalendar } from "./helpers/timeBoundaryToGoogleCalendar.helper";
import {
  createEvent,
  deleteEvent,
} from "../google_services/googleCalendar.service";
import { validateTimeOff } from "./helpers/validateTimeOff.helper";
import { ValidationError } from "../../errors/validationError";

export async function createTimeOff(
  input: ScheduledTime,
): Promise<calendar_v3.Schema$Event> {
  validateTimeOff(input);

  const googleEvent: calendar_v3.Schema$Event = {
    summary: input.summary,
    start: timeBoundaryToGoogleCalendar(input.start),
    end: timeBoundaryToGoogleCalendar(input.end),
  };

  return await createEvent(googleEvent);
}

export async function deleteTimeOff(eventId: string): Promise<void> {
  if (typeof eventId !== "string" || eventId.trim() === "") {
    throw new ValidationError("eventId is required.");
  }

  await deleteEvent(eventId);
}
