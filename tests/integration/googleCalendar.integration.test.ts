import { describe, it, expect } from "vitest";
import fs from "fs";
import {
  createEvent,
  deleteEvent,
  listUpcomingEvents,
} from "../../src/services/google_services/googleCalendar.service";

// Opt-in integration test — talks to the REAL Google Calendar API.
// Skipped unless GOOGLE_INTEGRATION=1 (use `npm run test:google` or the
// "Debug Google integration test" launch config). Also requires an OAuth
// token at /tmp/credentials.json — boot the server and visit /auth to
// create one on this machine.
const RUN =
  process.env.GOOGLE_INTEGRATION === "1" &&
  fs.existsSync("/tmp/credentials.json");

describe.runIf(RUN)("google calendar integration", () => {
  it("creates, lists, and deletes a real event", async () => {
    const start = new Date(Date.now() + 60 * 60 * 1000);
    const end = new Date(start.getTime() + 30 * 60 * 1000);

    const created = await createEvent({
      summary: "integration-test event (safe to delete)",
      start: {
        dateTime: start.toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      end: {
        dateTime: end.toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
    });

    expect(created.id).toBeTruthy();

    try {
      const events = await listUpcomingEvents(50);
      expect(events.some((event) => event.id === created.id)).toBe(true);
    } finally {
      // Always remove the test event from the real calendar, even if the
      // assertion above fails.
      await deleteEvent(created.id!);
    }
  }, 30_000);
});
