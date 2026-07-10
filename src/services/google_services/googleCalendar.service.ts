import { google, calendar_v3 } from "googleapis";
import { oauth2Client } from "./googleAuth.service";

export async function listUpcomingEvents(
  maxResults = 10,
): Promise<calendar_v3.Schema$Event[]> {
  const calendar = google.calendar({ version: "v3", auth: oauth2Client });

  const response = await calendar.events.list({
    calendarId: "primary",
    timeMin: new Date().toISOString(),
    maxResults,
    singleEvents: true,
    orderBy: "startTime",
  });

  return response.data.items ?? [];
}

export async function createEvent(
  event: calendar_v3.Schema$Event,
): Promise<calendar_v3.Schema$Event> {
  const calendar = google.calendar({ version: "v3", auth: oauth2Client });

  const response = await calendar.events.insert({
    calendarId: "primary",
    requestBody: event,
  });
  return response.data;
}

export async function deleteEvent(eventId: string): Promise<void> {
  const calendar = google.calendar({ version: "v3", auth: oauth2Client });

  await calendar.events.delete({
    calendarId: "primary",
    eventId,
  });
}
