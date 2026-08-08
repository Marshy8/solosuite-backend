import { Router, Request, Response } from "express";
import { ValidationError } from "../errors/validationError";
import {
  listClientNotes,
  getClientName,
  upsertClientNotes,
} from "../services/client_notes_services/clientNotes.service";

export const clientNotesRouter = Router();

function handleError(err: unknown, res: Response) {
  console.error(err);
  if (err instanceof ValidationError) {
    res.status(400).json({ error: err.message });
  } else {
    res.status(500).json({ error: "Client notes request failed" });
  }
}

clientNotesRouter.get(
  "/clientNotes/:client_identifier",
  async (req: Request, res: Response) => {
    try {
      const clientNotes = await listClientNotes(req.params.client_identifier);
      res.json(clientNotes);
    } catch (err) {
      handleError(err, res);
    }
  },
);

// Client-facing lookup — returns only the name, never the barber's private notes.
clientNotesRouter.get(
  "/clientNotes/:client_identifier/name",
  async (req: Request, res: Response) => {
    try {
      const name = await getClientName(req.params.client_identifier);
      res.json(name);
    } catch (err) {
      handleError(err, res);
    }
  },
);

clientNotesRouter.put("/clientNotes", async (req: Request, res: Response) => {
  try {
    await upsertClientNotes(req.body);
    res.status(204).send();
  } catch (err) {
    handleError(err, res);
  }
});
