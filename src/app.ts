import express from "express";
import { authRouter } from "./routes/auth.routes";
import { calendarRouter } from "./routes/calendar.routes";
import { dayScheduleRouter } from "./routes/daySchedule.routes";
import { timeOffRouter } from "./routes/timeOff.routes";
import "./db/connection";
import { serviceTypeRouter } from "./routes/serviceType.routes";
import { generalSettingsRouter } from "./routes/generalSettings.routes";
import { availabilityRouter } from "./routes/availability.routes";
import { clientNotesRouter } from "./routes/clientNotes.routes";

export const app = express();

app.use(express.json());
app.use(authRouter);
app.use(calendarRouter);
app.use(dayScheduleRouter);
app.use(timeOffRouter);
app.use(serviceTypeRouter);
app.use(generalSettingsRouter);
app.use(availabilityRouter);
app.use(clientNotesRouter);
