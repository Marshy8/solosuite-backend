import { describe, it, expect, vi, beforeEach } from "vitest";

// Stub the Google layer before importing the service under test — same
// pattern as tests/routes/timeOff.router.test.ts.
vi.mock("../../src/services/google_services/googleCalendar.service", () => ({
  createEvent: vi.fn(),
}));

import { createBooking } from "../../src/services/booking_services/booking.service";
import { createEvent } from "../../src/services/google_services/googleCalendar.service";
import { ValidationError } from "../../src/errors/validationError";

const createEventMock = vi.mocked(createEvent);

beforeEach(() => {
  vi.clearAllMocks();
});

describe("createBooking", () => {
  it("creates an event with no description for a brand-new client", async () => {
    createEventMock.mockResolvedValue({ id: "evt_1" });

    await createBooking({
      client_identifier: "(555) 555-0199",
      client_name: "Casey Nguyen",
      service_type_id: 1, // Buzz Cut, 15 min + no override -> general buffer of 15 min
      start_time: "2026-09-01T14:00:00.000Z",
    });

    expect(createEventMock).toHaveBeenCalledWith({
      summary: "Buzz Cut — Casey Nguyen — (555) 555-0199",
      start: { dateTime: "2026-09-01T14:00:00.000Z" },
      end: { dateTime: "2026-09-01T14:30:00.000Z" },
    });
  });

  it("enriches the description with the client's last visit when a note exists", async () => {
    createEventMock.mockResolvedValue({ id: "evt_2" });

    await createBooking({
      client_identifier: "(555) 555-0101", // seeded: Jordan Lee, last_service_type_id 2
      client_name: "Jordan Lee",
      service_type_id: 1,
      start_time: "2026-09-01T14:00:00.000Z",
    });

    expect(createEventMock).toHaveBeenCalledWith(
      expect.objectContaining({
        description:
          "Last visit: Classic Haircut — Wants a bit more taper on the sides next time, mentioned starting a new job.",
      }),
    );
  });

  it("computes the end time from the service's duration plus its buffer override", async () => {
    createEventMock.mockResolvedValue({ id: "evt_3" });

    await createBooking({
      client_identifier: "(555) 555-0301",
      client_name: "New Client",
      service_type_id: 5, // Hot Towel Shave, 40 min duration + 10 min override -> 50 min total
      start_time: "2026-09-01T10:00:00.000Z",
    });

    expect(createEventMock).toHaveBeenCalledWith(
      expect.objectContaining({
        start: { dateTime: "2026-09-01T10:00:00.000Z" },
        end: { dateTime: "2026-09-01T10:50:00.000Z" },
      }),
    );
  });

  it("returns whatever createEvent resolves with", async () => {
    createEventMock.mockResolvedValue({ id: "evt_4", summary: "test" });

    const result = await createBooking({
      client_identifier: "(555) 555-0302",
      client_name: "Another Client",
      service_type_id: 1,
      start_time: "2026-09-01T14:00:00.000Z",
    });

    expect(result).toEqual({ id: "evt_4", summary: "test" });
  });

  it("throws ValidationError for invalid input and never calls Google", async () => {
    await expect(
      createBooking({
        client_identifier: "",
        client_name: "Casey Nguyen",
        service_type_id: 1,
        start_time: "2026-09-01T14:00:00.000Z",
      } as never),
    ).rejects.toThrow(ValidationError);

    expect(createEventMock).not.toHaveBeenCalled();
  });

  it("throws ValidationError when client_identifier isn't formatted as a phone number", async () => {
    await expect(
      createBooking({
        client_identifier: "555-0199",
        client_name: "Casey Nguyen",
        service_type_id: 1,
        start_time: "2026-09-01T14:00:00.000Z",
      } as never),
    ).rejects.toThrow(/client_identifier/);

    expect(createEventMock).not.toHaveBeenCalled();
  });
});
