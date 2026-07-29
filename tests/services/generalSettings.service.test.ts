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
    });

    expect(listGeneralSettings()).toEqual({
      id: 1,
      worker_name: "Jane Doe",
      rolling_schedule_length: 30,
      buffer_minutes: 10,
    });
  });

  it("accepts null for rolling_schedule_length and buffer_minutes", () => {
    updateGeneralSettings({
      id: 1,
      worker_name: "Jane Doe",
      rolling_schedule_length: null,
      buffer_minutes: null,
    });

    expect(listGeneralSettings()).toEqual({
      id: 1,
      worker_name: "Jane Doe",
      rolling_schedule_length: null,
      buffer_minutes: null,
    });
  });

  it("rejects an id other than 1", () => {
    const before = listGeneralSettings();

    expect(() =>
      updateGeneralSettings({
        id: 2 as 1,
        worker_name: "Someone",
        rolling_schedule_length: 30,
        buffer_minutes: 10,
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
      }),
    ).toThrow(/buffer_minutes/);

    expect(listGeneralSettings()).toEqual(before);
  });
});
