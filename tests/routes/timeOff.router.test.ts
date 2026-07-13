import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";

// Stub the Google layer before importing the app. The factory must include
// every export the app's import graph touches: calendar.routes also pulls in
// listUpcomingEvents + createEvent from this same module.
vi.mock("../../src/services/google_services/googleCalendar.service", () => ({
  listUpcomingEvents: vi.fn(),
  createEvent: vi.fn(),
  deleteEvent: vi.fn(),
}));

import { app } from "../../src/app";
import {
  createEvent,
  deleteEvent,
} from "../../src/services/google_services/googleCalendar.service";

const createEventMock = vi.mocked(createEvent);
const deleteEventMock = vi.mocked(deleteEvent);

beforeEach(() => {
  vi.clearAllMocks();
});

describe("POST /timeOff", () => {
  it("creates time off and returns 201 with the created event", async () => {
    createEventMock.mockResolvedValue({ id: "evt_789", summary: "Vacation" });

    const res = await request(app)
      .post("/timeOff")
      .send({
        summary: "Vacation",
        start: { kind: "fullDay", date: "2026-08-10" },
        end: { kind: "fullDay", date: "2026-08-17" },
      });

    expect(res.status).toBe(201);
    expect(res.body).toEqual({ id: "evt_789", summary: "Vacation" });
    expect(createEventMock).toHaveBeenCalledWith({
      summary: "Vacation",
      start: { date: "2026-08-10" },
      end: { date: "2026-08-17" },
    });
  });

  it("rejects invalid input with 400 and never calls Google", async () => {
    const res = await request(app)
      .post("/timeOff")
      .send({
        summary: "",
        start: { kind: "fullDay", date: "2026-08-10" },
        end: { kind: "fullDay", date: "2026-08-17" },
      });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/summary/);
    expect(createEventMock).not.toHaveBeenCalled();
  });

  it("returns 502 when Google Calendar fails", async () => {
    createEventMock.mockRejectedValue(new Error("google boom"));

    const res = await request(app)
      .post("/timeOff")
      .send({
        summary: "Vacation",
        start: { kind: "fullDay", date: "2026-08-10" },
        end: { kind: "fullDay", date: "2026-08-17" },
      });

    expect(res.status).toBe(502);
  });
});

describe("DELETE /timeOff/:eventId", () => {
  it("deletes the event and returns 204", async () => {
    const res = await request(app).delete("/timeOff/evt_789");

    expect(res.status).toBe(204);
    expect(deleteEventMock).toHaveBeenCalledWith("evt_789");
  });

  it("returns 502 when Google Calendar fails to delete", async () => {
    deleteEventMock.mockRejectedValue(new Error("google boom"));

    const res = await request(app).delete("/timeOff/evt_789");

    expect(res.status).toBe(502);
  });
});
