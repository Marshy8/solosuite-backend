import { describe, it, expect } from "vitest";
import { padIntervalEnd } from "../../src/services/scheduling_services/helpers/padIntervalEnd.helper";

describe("padIntervalEnd", () => {
  it("extends the end by the given number of minutes", () => {
    const interval = {
      start: new Date("2026-08-10T09:00:00.000Z"),
      end: new Date("2026-08-10T09:30:00.000Z"),
    };

    expect(padIntervalEnd(interval, 15)).toEqual({
      start: new Date("2026-08-10T09:00:00.000Z"),
      end: new Date("2026-08-10T09:45:00.000Z"),
    });
  });

  it("leaves the end unchanged when bufferMinutes is 0", () => {
    const interval = {
      start: new Date("2026-08-10T09:00:00.000Z"),
      end: new Date("2026-08-10T09:30:00.000Z"),
    };

    expect(padIntervalEnd(interval, 0).end).toEqual(
      new Date("2026-08-10T09:30:00.000Z"),
    );
  });

  it("rolls over an hour boundary correctly", () => {
    const interval = {
      start: new Date("2026-08-10T09:00:00.000Z"),
      end: new Date("2026-08-10T10:40:00.000Z"),
    };

    expect(padIntervalEnd(interval, 50).end).toEqual(
      new Date("2026-08-10T11:30:00.000Z"),
    );
  });

  it("does not mutate the input interval", () => {
    const interval = {
      start: new Date("2026-08-10T09:00:00.000Z"),
      end: new Date("2026-08-10T09:30:00.000Z"),
    };
    const originalEnd = interval.end.getTime();

    padIntervalEnd(interval, 15);

    expect(interval.end.getTime()).toBe(originalEnd);
  });
});
