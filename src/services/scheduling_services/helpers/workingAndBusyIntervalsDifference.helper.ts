import { TimeChunk } from "../../../types/timeChunk.type";

export function workingAndBusyIntervalsDifference(
  workingIntervals: TimeChunk[],
  busyInterval: TimeChunk,
): TimeChunk[] {
  return workingIntervals.flatMap((chunk) =>
    subtractFromChunk(chunk, busyInterval),
  );
}

function subtractFromChunk(chunk: TimeChunk, busy: TimeChunk): TimeChunk[] {
  const noOverlap =
    busy.end.getTime() <= chunk.start.getTime() ||
    busy.start.getTime() >= chunk.end.getTime();
  if (noOverlap) {
    return [chunk];
  }

  const fullyCovers =
    busy.start.getTime() <= chunk.start.getTime() &&
    busy.end.getTime() >= chunk.end.getTime();
  if (fullyCovers) {
    return [];
  }

  const survivingPieces: TimeChunk[] = [];

  if (busy.start.getTime() > chunk.start.getTime()) {
    survivingPieces.push({ start: chunk.start, end: busy.start });
  }

  if (busy.end.getTime() < chunk.end.getTime()) {
    survivingPieces.push({ start: busy.end, end: chunk.end });
  }

  return survivingPieces;
}
