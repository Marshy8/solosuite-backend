import { Router, Request, Response } from "express";
import {
  getWeekSchedule,
  setDaySchedule,
} from "../services/scheduling_services/dayScheduling.service";
import { ValidationError } from "../errors/validationError";

export const dayScheduleRouter = Router();

// Bad input -> 400; anything else is a local (DB) failure -> 500.
function handleError(err: unknown, res: Response) {
  console.error(err);
  if (err instanceof ValidationError) {
    res.status(400).json({ error: err.message });
  } else {
    res.status(500).json({ error: "Day schedule request failed" });
  }
}

dayScheduleRouter.get("/daySchedule", async (req: Request, res: Response) => {
  try {
    const schedule = await getWeekSchedule();
    res.json(schedule);
  } catch (err) {
    handleError(err, res);
  }
});

dayScheduleRouter.put("/daySchedule", async (req: Request, res: Response) => {
  try {
    await setDaySchedule(req.body);
    res.status(204).send();
  } catch (err) {
    handleError(err, res);
  }
});
