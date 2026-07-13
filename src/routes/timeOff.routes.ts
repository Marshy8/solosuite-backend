import { Router, Request, Response } from "express";
import {
  createTimeOff,
  deleteTimeOff,
} from "../services/scheduling_services/timeOffScheduling.service";
import { ValidationError } from "../errors/validationError";

export const timeOffRouter = Router();

// Bad input -> 400; anything else is an upstream Google Calendar failure -> 502.
function handleError(err: unknown, res: Response) {
  console.error(err);
  if (err instanceof ValidationError) {
    res.status(400).json({ error: err.message });
  } else {
    res.status(502).json({ error: "Google Calendar request failed" });
  }
}

timeOffRouter.post("/timeOff", async (req: Request, res: Response) => {
  try {
    const event = await createTimeOff(req.body);
    res.status(201).json(event);
  } catch (err) {
    handleError(err, res);
  }
});

timeOffRouter.delete(
  "/timeOff/:eventId",
  async (req: Request, res: Response) => {
    try {
      await deleteTimeOff(req.params.eventId);
      res.status(204).send();
    } catch (err) {
      handleError(err, res);
    }
  },
);
