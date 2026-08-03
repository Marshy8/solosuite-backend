import { describe, it, expect } from "vitest";
import { sliceFreeIntervalsIntoSlots } from "../../src/services/scheduling_services/helpers/sliceFreeIntervalsIntoSlots.helper";

function time(hhmm: string): Date {
  return new Date(`2026-08-10T${hhmm}:00.000Z`);
}

describe("sliceFreeIntervalsIntoSlots", () => {
  it("produces slots every 5 minutes while the span still fits", () => {
    const interval = { start: time("09:00"), end: time("10:00") };

    const slots = sliceFreeIntervalsIntoSlots([interval], 30);

    expect(slots).toEqual([
      time("09:00"),
      time("09:05"),
      time("09:10"),
      time("09:15"),
      time("09:20"),
      time("09:25"),
      time("09:30"),
    ]);
  });

  it("rounds a chunk start that isn't on the grid up to the next 5-minute mark", () => {
    const interval = { start: time("09:07"), end: time("09:20") };

    const slots = sliceFreeIntervalsIntoSlots([interval], 5);

    expect(slots).toEqual([time("09:10"), time("09:15")]);
  });

  it("produces no slots when the chunk is shorter than the required span", () => {
    const interval = { start: time("09:00"), end: time("09:10") };

    const slots = sliceFreeIntervalsIntoSlots([interval], 15);

    expect(slots).toEqual([]);
  });

  it("produces exactly one slot when the chunk exactly fits the span", () => {
    const interval = { start: time("09:00"), end: time("09:30") };

    const slots = sliceFreeIntervalsIntoSlots([interval], 30);

    expect(slots).toEqual([time("09:00")]);
  });

  it("does not shift a start that already sits on the grid", () => {
    const interval = { start: time("09:00"), end: time("09:05") };

    const slots = sliceFreeIntervalsIntoSlots([interval], 5);

    expect(slots).toEqual([time("09:00")]);
  });

  it("slices multiple free chunks independently, in order", () => {
    const morning = { start: time("09:00"), end: time("09:10") };
    const afternoon = { start: time("13:00"), end: time("13:10") };

    const slots = sliceFreeIntervalsIntoSlots([morning, afternoon], 10);

    expect(slots).toEqual([time("09:00"), time("13:00")]);
  });

  it("returns an empty array for an empty input", () => {
    expect(sliceFreeIntervalsIntoSlots([], 30)).toEqual([]);
  });
});
