export type TimeBoundary =
  | { kind: "fullDay"; date: string }
  | { kind: "specificTime"; dateTime: string; timeZone: string };
