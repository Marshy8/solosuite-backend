import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { getAvailableSlots } from "../../src/services/scheduling_services/availability.service";
import { getBusyIntervals } from "../../src/services/google_services/googleCalendar.service";
import { updateGeneralSettings } from "../../src/services/general_settings_service/generalSettings.service";
import { setDaySchedule } from "../../src/services/scheduling_services/dayScheduling.service";
import { deactivateServiceType } from "../../src/services/service_type_services/serviceType.service";

// Replace the Google layer entirely: no network, no OAuth client, and we get
// to assert exactly what busy data the engine reasons over.
vi.mock("../../src/services/google_services/googleCalendar.service", () => ({
  getBusyIntervals: vi.fn(),
}));

const getBusyIntervalsMock = vi.mocked(getBusyIntervals);

beforeEach(() => {
  vi.clearAllMocks();
  getBusyIntervalsMock.mockResolvedValue([]);
});

afterEach(() => {
  vi.useRealTimers();
});

function setGeneralSettings(
  overrides: Partial<{
    rolling_schedule_length: number;
    buffer_minutes: number;
    timezone: string;
  }> = {},
) {
  updateGeneralSettings({
    id: 1,
    worker_name: "Buck Harris",
    rolling_schedule_length: 1,
    buffer_minutes: 15,
    timezone: "America/New_York",
    ...overrides,
  });
}

describe("getAvailableSlots", () => {
  it("subtracts a busy interval from the working window and slices the remainder", async () => {
    setGeneralSettings();
    setDaySchedule({
      day: 1,
      is_working: true,
      start_time: "09:00",
      end_time: "10:00",
    });

    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-08-10T06:00:00.000Z")); // 02:00 EDT Monday — before opening

    getBusyIntervalsMock.mockResolvedValue([
      { start: "2026-08-10T13:30:00.000Z", end: "2026-08-10T13:35:00.000Z" }, // 09:30-09:35 EDT
    ]);

    // Buzz Cut (id 1): duration 15, no buffer override -> span = 15 + 15 = 30
    const slots = await getAvailableSlots(1);

    expect(slots).toEqual([new Date("2026-08-10T13:00:00.000Z")]);
  });

  it("clips today's window to the current time", async () => {
    setGeneralSettings();
    setDaySchedule({
      day: 1,
      is_working: true,
      start_time: "09:00",
      end_time: "10:00",
    });

    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-08-10T13:30:00.000Z")); // 09:30 EDT Monday — mid-window

    const slots = await getAvailableSlots(1);

    expect(slots).toEqual([new Date("2026-08-10T13:30:00.000Z")]);
  });

  it("returns no slots on a day the barber isn't working", async () => {
    setGeneralSettings();

    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-08-09T13:00:00.000Z")); // Sunday — seeded as a day off

    const slots = await getAvailableSlots(1);

    expect(slots).toEqual([]);
  });

  it("rejects a non-integer serviceTypeId without calling Google", async () => {
    await expect(getAvailableSlots(1.5)).rejects.toThrow(/serviceTypeId/);
    expect(getBusyIntervalsMock).not.toHaveBeenCalled();
  });

  it("rejects an unknown serviceTypeId without calling Google", async () => {
    await expect(getAvailableSlots(999)).rejects.toThrow(/No service type/);
    expect(getBusyIntervalsMock).not.toHaveBeenCalled();
  });

  it("rejects a deactivated service type without calling Google", async () => {
    deactivateServiceType(4);

    await expect(getAvailableSlots(4)).rejects.toThrow(/not active/);
    expect(getBusyIntervalsMock).not.toHaveBeenCalled();
  });
});
