import { describe, it, expect } from "vitest";
import {
  getDayWorkingHours,
  setDaySchedule,
} from "../../src/services/scheduling_services/dayScheduling.service";

describe("getDayWorkingHours", () => {
  it("returns the seeded hours for a working day", () => {
    expect(getDayWorkingHours(1)).toEqual({
      start: {
        kind: "specificTime",
        dateTime: "09:00",
        timeZone: "America/New_York",
      },
      end: {
        kind: "specificTime",
        dateTime: "17:00",
        timeZone: "America/New_York",
      },
    });
  });

  it("returns undefined for the seeded day off (Sunday)", () => {
    expect(getDayWorkingHours(0)).toBeUndefined();
  });
});

describe("setDaySchedule", () => {
  it("sets a working day and reads it back", () => {
    setDaySchedule({
      day: 3,
      is_working: true,
      start_time: "10:00",
      end_time: "16:30",
    });

    expect(getDayWorkingHours(3)).toEqual({
      start: {
        kind: "specificTime",
        dateTime: "10:00",
        timeZone: "America/New_York",
      },
      end: {
        kind: "specificTime",
        dateTime: "16:30",
        timeZone: "America/New_York",
      },
    });
  });

  it("sets a day off", () => {
    setDaySchedule({ day: 4, is_working: false });
    expect(getDayWorkingHours(4)).toBeUndefined();
  });

  it("can set Sunday (day 0) to working", () => {
    setDaySchedule({
      day: 0,
      is_working: true,
      start_time: "12:00",
      end_time: "15:00",
    });
    expect(getDayWorkingHours(0)).toBeDefined();
  });

  it("accepts minutes with any tens digit (09:30)", () => {
    setDaySchedule({
      day: 5,
      is_working: true,
      start_time: "09:30",
      end_time: "14:45",
    });
    expect(getDayWorkingHours(5)).toBeDefined();
  });

  it("rejects days outside 0-6", () => {
    expect(() => setDaySchedule({ day: 7, is_working: false })).toThrow(/0-6/);
    expect(() => setDaySchedule({ day: -1, is_working: false })).toThrow(/0-6/);
    expect(() => setDaySchedule({ day: 3.5, is_working: false })).toThrow(
      /0-6/,
    );
  });

  it("rejects times that are not HH:MM", () => {
    expect(() =>
      setDaySchedule({
        day: 2,
        is_working: true,
        start_time: "9:00",
        end_time: "17:00",
      }),
    ).toThrow(/HH:MM/);
    expect(() =>
      setDaySchedule({
        day: 2,
        is_working: true,
        start_time: "25:00",
        end_time: "26:00",
      }),
    ).toThrow(/HH:MM/);
  });

  it("rejects start times at or after the end time", () => {
    expect(() =>
      setDaySchedule({
        day: 2,
        is_working: true,
        start_time: "17:00",
        end_time: "09:00",
      }),
    ).toThrow(/before/);
    expect(() =>
      setDaySchedule({
        day: 2,
        is_working: true,
        start_time: "09:00",
        end_time: "09:00",
      }),
    ).toThrow(/before/);
  });
});
