import { describe, it, expect } from "vitest";
import { workingAndBusyIntervalsDifference } from "../../src/services/scheduling_services/helpers/workingAndBusyIntervalsDifference.helper";

function time(hhmm: string): Date {
  return new Date(`2026-08-10T${hhmm}:00.000Z`);
}

describe("workingAndBusyIntervalsDifference", () => {
  const workingDay = { start: time("09:00"), end: time("17:00") };

  it("returns the chunk unchanged when busy is entirely before it", () => {
    const busy = { start: time("07:00"), end: time("08:00") };
    expect(workingAndBusyIntervalsDifference([workingDay], busy)).toEqual([
      workingDay,
    ]);
  });

  it("returns the chunk unchanged when busy is entirely after it", () => {
    const busy = { start: time("18:00"), end: time("19:00") };
    expect(workingAndBusyIntervalsDifference([workingDay], busy)).toEqual([
      workingDay,
    ]);
  });

  it("treats a busy block that only touches the edge as no overlap", () => {
    const touchesStart = { start: time("08:00"), end: time("09:00") };
    const touchesEnd = { start: time("17:00"), end: time("18:00") };

    expect(
      workingAndBusyIntervalsDifference([workingDay], touchesStart),
    ).toEqual([workingDay]);
    expect(
      workingAndBusyIntervalsDifference([workingDay], touchesEnd),
    ).toEqual([workingDay]);
  });

  it("drops the chunk entirely when busy fully covers it", () => {
    const busy = { start: time("08:00"), end: time("18:00") };
    expect(workingAndBusyIntervalsDifference([workingDay], busy)).toEqual([]);
  });

  it("drops the chunk when busy exactly matches it", () => {
    const busy = { start: time("09:00"), end: time("17:00") };
    expect(workingAndBusyIntervalsDifference([workingDay], busy)).toEqual([]);
  });

  it("shrinks from the left when busy overlaps the start", () => {
    const busy = { start: time("08:00"), end: time("10:00") };
    expect(workingAndBusyIntervalsDifference([workingDay], busy)).toEqual([
      { start: time("10:00"), end: time("17:00") },
    ]);
  });

  it("shrinks from the right when busy overlaps the end", () => {
    const busy = { start: time("16:00"), end: time("18:00") };
    expect(workingAndBusyIntervalsDifference([workingDay], busy)).toEqual([
      { start: time("09:00"), end: time("16:00") },
    ]);
  });

  it("splits into two pieces when busy sits in the middle", () => {
    const busy = { start: time("12:00"), end: time("13:00") };
    expect(workingAndBusyIntervalsDifference([workingDay], busy)).toEqual([
      { start: time("09:00"), end: time("12:00") },
      { start: time("13:00"), end: time("17:00") },
    ]);
  });

  it("only affects the chunk it overlaps when multiple working chunks are given", () => {
    const morning = { start: time("09:00"), end: time("12:00") };
    const afternoon = { start: time("13:00"), end: time("17:00") };
    const busy = { start: time("10:00"), end: time("11:00") };

    expect(
      workingAndBusyIntervalsDifference([morning, afternoon], busy),
    ).toEqual([
      { start: time("09:00"), end: time("10:00") },
      { start: time("11:00"), end: time("12:00") },
      afternoon,
    ]);
  });
});
