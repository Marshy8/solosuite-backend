import { describe, it, expect } from "vitest";
import {
  listGeneralSettings,
  updateGeneralSettings,
} from "../../src/services/general_settings_service/generalSettings.service";

describe("listGeneralSettings", () => {
  it("returns the seeded singleton row", () => {
    expect(listGeneralSettings()).toEqual({
      id: 1,
      worker_name: "Buck Harris",
      rolling_schedule_length: 60,
      buffer_minutes: 15,
      timezone: "America/New_York",
    });
  });
});

describe("updateGeneralSettings", () => {
  it("updates the row and reads back the change", () => {
    updateGeneralSettings({
      id: 1,
      worker_name: "Jane Doe",
      rolling_schedule_length: 30,
      buffer_minutes: 10,
      timezone: "America/Chicago",
    });

    expect(listGeneralSettings()).toEqual({
      id: 1,
      worker_name: "Jane Doe",
      rolling_schedule_length: 30,
      buffer_minutes: 10,
      timezone: "America/Chicago",
    });
  });

  it("rejects null for rolling_schedule_length", () => {
    const before = listGeneralSettings();

    expect(() =>
      updateGeneralSettings({
        id: 1,
        worker_name: "Jane Doe",
        rolling_schedule_length: null as unknown as number,
        buffer_minutes: 10,
        timezone: "America/New_York",
      }),
    ).toThrow(/rolling_schedule_length/);

    expect(listGeneralSettings()).toEqual(before);
  });

  it("rejects null for buffer_minutes", () => {
    const before = listGeneralSettings();

    expect(() =>
      updateGeneralSettings({
        id: 1,
        worker_name: "Jane Doe",
        rolling_schedule_length: 30,
        buffer_minutes: null as unknown as number,
        timezone: "America/New_York",
      }),
    ).toThrow(/buffer_minutes/);

    expect(listGeneralSettings()).toEqual(before);
  });

  it("rejects a non-integer rolling_schedule_length", () => {
    const before = listGeneralSettings();

    expect(() =>
      updateGeneralSettings({
        id: 1,
        worker_name: "Jane Doe",
        rolling_schedule_length: 30.5,
        buffer_minutes: 10,
        timezone: "America/New_York",
      }),
    ).toThrow(/rolling_schedule_length/);

    expect(listGeneralSettings()).toEqual(before);
  });

  it("rejects an id other than 1", () => {
    const before = listGeneralSettings();

    expect(() =>
      updateGeneralSettings({
        id: 2 as 1,
        worker_name: "Someone",
        rolling_schedule_length: 30,
        buffer_minutes: 10,
        timezone: "America/New_York",
      }),
    ).toThrow(/id/);

    expect(listGeneralSettings()).toEqual(before);
  });

  it("rejects an empty worker_name", () => {
    const before = listGeneralSettings();

    expect(() =>
      updateGeneralSettings({
        id: 1,
        worker_name: "   ",
        rolling_schedule_length: 30,
        buffer_minutes: 10,
        timezone: "America/New_York",
      }),
    ).toThrow(/worker_name/);

    expect(listGeneralSettings()).toEqual(before);
  });

  it("rejects a negative rolling_schedule_length", () => {
    const before = listGeneralSettings();

    expect(() =>
      updateGeneralSettings({
        id: 1,
        worker_name: "Jane Doe",
        rolling_schedule_length: -1,
        buffer_minutes: 10,
        timezone: "America/New_York",
      }),
    ).toThrow(/rolling_schedule_length/);

    expect(listGeneralSettings()).toEqual(before);
  });

  it("rejects a negative buffer_minutes", () => {
    const before = listGeneralSettings();

    expect(() =>
      updateGeneralSettings({
        id: 1,
        worker_name: "Jane Doe",
        rolling_schedule_length: 30,
        buffer_minutes: -1,
        timezone: "America/New_York",
      }),
    ).toThrow(/buffer_minutes/);

    expect(listGeneralSettings()).toEqual(before);
  });

  it("rejects an empty timezone", () => {
    const before = listGeneralSettings();

    expect(() =>
      updateGeneralSettings({
        id: 1,
        worker_name: "Jane Doe",
        rolling_schedule_length: 30,
        buffer_minutes: 10,
        timezone: "   ",
      }),
    ).toThrow(/timezone/);

    expect(listGeneralSettings()).toEqual(before);
  });

  it("rejects a timezone that isn't a valid IANA name", () => {
    const before = listGeneralSettings();

    expect(() =>
      updateGeneralSettings({
        id: 1,
        worker_name: "Jane Doe",
        rolling_schedule_length: 30,
        buffer_minutes: 10,
        timezone: "Not/A_Real_Zone",
      }),
    ).toThrow(/timezone/);

    expect(listGeneralSettings()).toEqual(before);
  });
});
