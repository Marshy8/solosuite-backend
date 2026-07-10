import express from "express";
import { env } from "./config/env";
import { authRouter } from "./routes/auth.routes";
import { calendarRouter } from "./routes/calendar.routes";
import "./db/connection";

const app = express();

app.use(express.json());
app.use(authRouter);
app.use(calendarRouter);

app.listen(env.port, () => console.log(`listening on ${env.port}`));
