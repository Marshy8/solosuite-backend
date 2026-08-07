import { Router, Request, Response } from "express";
import { ValidationError } from "../errors/validationError";
import { createBooking } from "../services/booking_services/booking.service";

export const bookingRouter = Router();

// Bad input -> 400; anything else is an upstream Google Calendar failure -> 502.
function handleError(err: unknown, res: Response) {
  console.error(err);
  if (err instanceof ValidationError) {
    res.status(400).json({ error: err.message });
  } else {
    res.status(502).json({ error: "Booking request failed" });
  }
}

bookingRouter.post("/booking", async (req: Request, res: Response) => {
  try {
    await createBooking(req.body);
    res.status(204).send();
  } catch (err) {
    handleError(err, res);
  }
});
