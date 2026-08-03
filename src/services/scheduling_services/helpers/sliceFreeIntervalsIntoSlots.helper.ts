import { TimeChunk } from "../../../types/timeChunk.type";

const GRID_MINUTES = 5;
const GRID_MS = GRID_MINUTES * 60 * 1000;

export function sliceFreeIntervalsIntoSlots(
  freeIntervals: TimeChunk[],
  spanMinutes: number,
): Date[] {
  const spanMs = spanMinutes * 60 * 1000;
  const slots: Date[] = [];

  for (const interval of freeIntervals) {
    const endMs = interval.end.getTime();
    let candidateMs = Math.ceil(interval.start.getTime() / GRID_MS) * GRID_MS;

    while (candidateMs + spanMs <= endMs) {
      slots.push(new Date(candidateMs));
      candidateMs += GRID_MS;
    }
  }

  return slots;
}
