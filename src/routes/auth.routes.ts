import { Router, Request, Response } from "express";
import { oauth2Client } from "../services/google_services/googleAuth.service";
import { saveTokens } from "../services/token_services/tokenStore.service";

export const authRouter = Router();

authRouter.get("/auth", (req: Request, res: Response) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: ["https://www.googleapis.com/auth/calendar"],
  });
  res.redirect(url);
});

authRouter.get("/oauth2callback", async (req: Request, res: Response) => {
  try {
    const code = req.query.code as string;
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    saveTokens(tokens);
    res.send("Authorized! You can close this tab.");
  } catch (err) {
    console.error(err);
    res.status(502).send("Google authorization failed. Please try again.");
  }
});
