import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  createTimeOff,
  deleteTimeOff,
  ValidationError,
} from "../../src/services/scheduling_services/timeOffScheduling.service";
import {
  createEvent,
  deleteEvent,
} from "../../src/services/google_services/googleCalendar.service";

// Replace the Google layer entirely: no network, no OAuth client, and we get
// to assert exactly what shape the service hands to Google.
vi.mock("../../src/services/google_services/googleCalendar.service", () => ({
  createEvent: vi.fn(),
  deleteEvent: vi.fn(),
}));

const createEventMock = vi.mocked(createEvent);
const deleteEventMock = vi.mocked(deleteEvent);

beforeEach(() => {
  vi.clearAllMocks();
});

describe("createTimeOff", () => {
  it("maps a full-day ScheduledTime to a Google event and returns the created event", async () => {
    createEventMock.mockResolvedValue({ id: "evt_123", summary: "Vacation" });

    const result = await createTimeOff({
      summary: "Vacation",
      start: { kind: "fullDay", date: "2026-08-10" },
      end: { kind: "fullDay", date: "2026-08-17" },
    });

    expect(createEventMock).toHaveBeenCalledWith({
      summary: "Vacation",
      start: { date: "2026-08-10" },
      end: { date: "2026-08-17" },
    });
    expect(result).toEqual({ id: "evt_123", summary: "Vacation" });
  });

  it("maps a specific-time ScheduledTime, carrying the timeZone through", async () => {
    createEventMock.mockResolvedValue({ id: "evt_456" });

    await createTimeOff({
      summary: "Dentist",
      start: {
        kind: "specificTime",
        dateTime: "2026-08-10T12:00:00",
        timeZone: "America/New_York",
      },
      end: {
        kind: "specificTime",
        dateTime: "2026-08-10T13:00:00",
        timeZone: "America/New_York",
      },
    });

    expect(createEventMock).toHaveBeenCalledWith({
      summary: "Dentist",
      start: { dateTime: "2026-08-10T12:00:00", timeZone: "America/New_York" },
      end: { dateTime: "2026-08-10T13:00:00", timeZone: "America/New_York" },
    });
  });

  it("rejects a missing summary without calling Google", async () => {
    await expect(
      createTimeOff({
        start: { kind: "fullDay", date: "2026-08-10" },
        end: { kind: "fullDay", date: "2026-08-17" },
      } as never),
    ).rejects.toThrow(ValidationError);
    expect(createEventMock).not.toHaveBeenCalled();
  });

  it("rejects a boundary with an unknown kind without calling Google", async () => {
    await expect(
      createTimeOff({
        summary: "Bad",
        start: { kind: "whenever" } as never,
        end: { kind: "fullDay", date: "2026-08-17" },
      }),
    ).rejects.toThrow(ValidationError);
    expect(createEventMock).not.toHaveBeenCalled();
  });
});

describe("deleteTimeOff", () => {
  it("deletes by event id", async () => {
    await deleteTimeOff("evt_123");
    expect(deleteEventMock).toHaveBeenCalledWith("evt_123");
  });

  it("rejects an empty id without calling Google", async () => {
    await expect(deleteTimeOff("")).rejects.toThrow(ValidationError);
    expect(deleteEventMock).not.toHaveBeenCalled();
  });
});
