// routes/calendar.routes.ts
import { Router, Request, Response } from "express";
import { listUpcomingEvents } from "../services/google_services/googleCalendar.service";
import { createEvent } from "../services/google_services/googleCalendar.service";

export const calendarRouter = Router();

calendarRouter.get("/calendar/events", async (req: Request, res: Response) => {
  try {
    const events = await listUpcomingEvents();
    res.json(events);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch calendar events" });
  }
});

calendarRouter.post("/calendar/events", async (req: Request, res: Response) => {
  try {
    const event = await createEvent(req.body);
    res.json(event);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create calendar event" });
  }
});
