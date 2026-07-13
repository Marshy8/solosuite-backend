export type DayScheduleInput =
  | { day: number; is_working: false }
  | { day: number; is_working: true; start_time: string; end_time: string };
