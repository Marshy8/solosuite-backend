import { db } from "../connection";
import { WeeklyScheduleRow } from "../../types/weeklyScheduleRow.type";

export function getWeeklySchedule(): WeeklyScheduleRow[] {
  return db
    .prepare("SELECT * FROM weekly_schedule")
    .all() as WeeklyScheduleRow[];
}

export function getScheduleForDay(id: number): WeeklyScheduleRow | undefined {
  return db
    .prepare("SELECT * FROM weekly_schedule WHERE id = ?")
    .get(id) as WeeklyScheduleRow;
}

export function updateDailySchedule(dailySchedule: WeeklyScheduleRow) {
  return db
    .prepare(
      "UPDATE weekly_schedule SET start_time = ?, end_time = ?, is_working = ?  WHERE id = ?",
    )
    .run(
      dailySchedule.start_time,
      dailySchedule.end_time,
      dailySchedule.is_working,
      dailySchedule.id,
    );
}
