import { calendar_v3 } from "googleapis";
import { BookingInput } from "../../types/inputs/bookingInput.type";
import { validateBooking } from "./helpers/validateBooking.helper";
import { getServiceType } from "../service_type_services/serviceType.service";
import { listClientNotes } from "../client_notes_services/clientNotes.service";
import { createEvent } from "../google_services/googleCalendar.service";
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

  const startTime = new Date(input.start_time);
  const endTime = addMinutes(startTime, serviceType.duration_minutes);

  const googleEvent: calendar_v3.Schema$Event = {
    summary: `${serviceType.name} — ${input.client_name}`,
    description,
    start: { dateTime: startTime.toISOString() },
    end: { dateTime: endTime.toISOString() },
  };

  return await createEvent(googleEvent);
}
