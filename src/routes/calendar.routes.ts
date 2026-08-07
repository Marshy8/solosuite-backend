import { Router, Request, Response } from "express";
import {
  listUpcomingEvents,
  createEvent,
} from "../services/google_services/googleCalendar.service";
import { ValidationError } from "../errors/validationError";

export const calendarRouter = Router();

// Bad input -> 400; anything else is an upstream Google Calendar failure -> 502.
function handleError(err: unknown, res: Response) {
  console.error(err);
  if (err instanceof ValidationError) {
    res.status(400).json({ error: err.message });
  } else {
    res.status(502).json({ error: "Google Calendar request failed" });
  }
}

calendarRouter.get("/calendar/events", async (req: Request, res: Response) => {
  try {
    const events = await listUpcomingEvents();
    res.json(events);
  } catch (err) {
    handleError(err, res);
  }
});

calendarRouter.post("/calendar/events", async (req: Request, res: Response) => {
  try {
    const event = await createEvent(req.body);
    res.json(event);
  } catch (err) {
    handleError(err, res);
  }
});
