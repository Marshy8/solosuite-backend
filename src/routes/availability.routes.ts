import { Router, Request, Response } from "express";
import { getAvailableSlots } from "../services/scheduling_services/availability.service";
import { ValidationError } from "../errors/validationError";

export const availabilityRouter = Router();

// Bad input -> 400; anything else is an upstream Google Calendar failure -> 502.
function handleError(err: unknown, res: Response) {
  console.error(err);
  if (err instanceof ValidationError) {
    res.status(400).json({ error: err.message });
  } else {
    res.status(502).json({ error: "Availability request failed" });
  }
}

availabilityRouter.get(
  "/availability",
  async (req: Request, res: Response) => {
    try {
      const serviceTypeId = Number(req.query.serviceTypeId);
      const slots = await getAvailableSlots(serviceTypeId);
      res.json(slots);
    } catch (err) {
      handleError(err, res);
    }
  },
);
