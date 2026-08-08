import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";

// Stub the Google layer before importing the app — same pattern as
// tests/routes/timeOff.router.test.ts. The factory must include every
// export the app's import graph touches (calendar.routes also pulls from
// this module), even though this file only exercises createEvent.
vi.mock("../../src/services/google_services/googleCalendar.service", () => ({
  listUpcomingEvents: vi.fn(),
  createEvent: vi.fn(),
  deleteEvent: vi.fn(),
}));

import { app } from "../../src/app";
import { createEvent } from "../../src/services/google_services/googleCalendar.service";

const createEventMock = vi.mocked(createEvent);

beforeEach(() => {
  vi.clearAllMocks();
});

describe("POST /booking", () => {
  it("creates a booking and returns 204", async () => {
    createEventMock.mockResolvedValue({ id: "evt_101" });

    const res = await request(app).post("/booking").send({
      client_identifier: "(555) 555-0199",
      client_name: "Casey Nguyen",
      service_type_id: 1,
      start_time: "2026-09-01T14:00:00.000Z",
    });

    expect(res.status).toBe(204);
    expect(createEventMock).toHaveBeenCalledWith({
      summary: "Buzz Cut — Casey Nguyen — (555) 555-0199",
      start: { dateTime: "2026-09-01T14:00:00.000Z" },
      end: { dateTime: "2026-09-01T14:30:00.000Z" },
    });
  });

  it("enriches the event description for a returning client", async () => {
    createEventMock.mockResolvedValue({ id: "evt_102" });

    const res = await request(app).post("/booking").send({
      client_identifier: "(555) 555-0142", // seeded: Sam Rivera, last_service_type_id 4
      client_name: "Sam Rivera",
      service_type_id: 3,
      start_time: "2026-09-01T09:00:00.000Z",
    });

    expect(res.status).toBe(204);
    expect(createEventMock).toHaveBeenCalledWith(
      expect.objectContaining({
        description:
          "Last visit: Haircut + Beard — Prefers the beard kept short and square, talked about his upcoming trip to Portugal.",
      }),
    );
  });

  it("rejects invalid input with 400 and never calls Google", async () => {
    const res = await request(app).post("/booking").send({
      client_identifier: "(555) 555-0199",
      client_name: "Casey Nguyen",
      service_type_id: "not-a-number",
      start_time: "2026-09-01T14:00:00.000Z",
    });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/service_type_id/);
    expect(createEventMock).not.toHaveBeenCalled();
  });

  it("rejects a missing client_identifier with 400", async () => {
    const res = await request(app).post("/booking").send({
      client_name: "Casey Nguyen",
      service_type_id: 1,
      start_time: "2026-09-01T14:00:00.000Z",
    });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/client_identifier/);
  });

  it("returns 502 when Google Calendar fails", async () => {
    createEventMock.mockRejectedValue(new Error("google boom"));

    const res = await request(app).post("/booking").send({
      client_identifier: "(555) 555-0199",
      client_name: "Casey Nguyen",
      service_type_id: 1,
      start_time: "2026-09-01T14:00:00.000Z",
    });

    expect(res.status).toBe(502);
  });
});
