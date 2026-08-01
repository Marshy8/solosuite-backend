import { describe, it, expect } from "vitest";
import { dateTimeNormalization } from "../../src/services/scheduling_services/helpers/zonedDateTime.helper";

describe("dateTimeNormalization", () => {
  it("combines a date and time into the correct UTC instant (EDT, summer)", () => {
    const result = dateTimeNormalization(
      "2026-08-10",
      "09:00",
      "America/New_York",
    );
    expect(result.toISOString()).toBe("2026-08-10T13:00:00.000Z");
  });

  it("accounts for DST — the same wall-clock time in winter (EST) yields a different UTC instant", () => {
    const result = dateTimeNormalization(
      "2026-01-10",
      "09:00",
      "America/New_York",
    );
    expect(result.toISOString()).toBe("2026-01-10T14:00:00.000Z");
  });

  it("uses the timeZone argument rather than a hardcoded zone", () => {
    const result = dateTimeNormalization(
      "2026-08-10",
      "09:00",
      "America/Los_Angeles",
    );
    expect(result.toISOString()).toBe("2026-08-10T16:00:00.000Z");
  });

  it("returns a real Date instance", () => {
    const result = dateTimeNormalization(
      "2026-08-10",
      "09:00",
      "America/New_York",
    );
    expect(result).toBeInstanceOf(Date);
  });
});
