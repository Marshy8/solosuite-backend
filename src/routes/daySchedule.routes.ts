import { Router, Request, Response } from "express";
import {
  getWeekSchedule,
  setDaySchedule,
} from "../services/scheduling_services/dayScheduling.service";

export const dayScheduleRouter = Router();

dayScheduleRouter.get("/daySchedule", async (req: Request, res: Response) => {
  try {
    const schedule = await getWeekSchedule();
    res.json(schedule);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch week schedule" });
  }
});

dayScheduleRouter.put("/daySchedule", async (req: Request, res: Response) => {
  try {
    await setDaySchedule(req.body);
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: (err as Error).message });
  }
});
