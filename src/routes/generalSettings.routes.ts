import { Router, Request, Response } from "express";
import { ValidationError } from "../errors/validationError";
import {
  listGeneralSettings,
  updateGeneralSettings,
} from "../services/general_settings_service/generalSettings.service";

export const generalSettingsRouter = Router();

function handleError(err: unknown, res: Response) {
  console.error(err);
  if (err instanceof ValidationError) {
    res.status(400).json({ error: err.message });
  } else {
    res.status(500).json({ error: "General settings request failed" });
  }
}

generalSettingsRouter.get(
  "/generalSettings",
  async (req: Request, res: Response) => {
    try {
      const generalSettings = await listGeneralSettings();
      res.json(generalSettings);
    } catch (err) {
      handleError(err, res);
    }
  },
);

generalSettingsRouter.put(
  "/generalSettings",
  async (req: Request, res: Response) => {
    try {
      await updateGeneralSettings(req.body);
      res.status(204).send();
    } catch (err) {
      handleError(err, res);
    }
  },
);
