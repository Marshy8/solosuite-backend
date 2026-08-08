import { calendar_v3 } from "googleapis";
import { BookingInput } from "../../types/inputs/bookingInput.type";
import { validateBooking } from "./helpers/validateBooking.helper";
import { getServiceType } from "../service_type_services/serviceType.service";
import { listClientNotes } from "../client_notes_services/clientNotes.service";
import { createEvent } from "../google_services/googleCalendar.service";
import { getGeneralSettings } from "../../db/queries/generalSettings.queries";
import { addMinutes } from "date-fns";

export async function createBooking(
  input: BookingInput,
): Promise<calendar_v3.Schema$Event> {
  validateBooking(input);

  const serviceType = getServiceType(input.service_type_id);

  const clientNotes = listClientNotes(input.client_identifier);

  let description: string | undefined;
  if (clientNotes && clientNotes.last_service_type_id !== null) {
    const prevServiceType = getServiceType(clientNotes.last_service_type_id);
    description = `Last visit: ${prevServiceType.name} — ${clientNotes.notes}`;
  }

  const settings = getGeneralSettings();
  if (!settings) {
    throw new Error("General settings are not configured.");
  }
  const bufferMinutes =
    serviceType.buffer_override_minutes ?? settings.buffer_minutes;

  const startTime = new Date(input.start_time);
  const endTime = addMinutes(
    startTime,
    serviceType.duration_minutes + bufferMinutes,
  );

  const googleEvent: calendar_v3.Schema$Event = {
    summary: `${serviceType.name} — ${input.client_name} — ${input.client_identifier}`,
    description,
    start: { dateTime: startTime.toISOString() },
    end: { dateTime: endTime.toISOString() },
  };

  return await createEvent(googleEvent);
}
