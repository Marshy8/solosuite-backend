import { Router, Request, Response } from "express";
import {
  createServiceType,
  deactivateServiceType,
  getServiceType,
  listActiveServiceTypes,
  listServiceTypes,
  updateServiceType,
} from "../services/service_type_services/serviceType.service";
import { ValidationError } from "../errors/validationError";

export const serviceTypeRouter = Router();

function handleError(err: unknown, res: Response) {
  console.error(err);
  if (err instanceof ValidationError) {
    res.status(400).json({ error: err.message });
  } else {
    res.status(500).json({ error: "Service type request failed" });
  }
}

serviceTypeRouter.get(
  "/serviceType/all",
  async (req: Request, res: Response) => {
    try {
      const serviceTypes = await listServiceTypes();
      res.json(serviceTypes);
    } catch (err) {
      handleError(err, res);
    }
  },
);

serviceTypeRouter.get(
  "/serviceType/active",
  async (req: Request, res: Response) => {
    try {
      const serviceTypes = await listActiveServiceTypes();
      res.json(serviceTypes);
    } catch (err) {
      handleError(err, res);
    }
  },
);

serviceTypeRouter.get(
  "/serviceType/:id",
  async (req: Request, res: Response) => {
    try {
      const serviceType = await getServiceType(Number(req.params.id));
      res.json(serviceType);
    } catch (err) {
      handleError(err, res);
    }
  },
);

serviceTypeRouter.post("/serviceType", async (req: Request, res: Response) => {
  try {
    await createServiceType(req.body);
    res.status(201).send();
  } catch (err) {
    handleError(err, res);
  }
});

serviceTypeRouter.put("/serviceType", async (req: Request, res: Response) => {
  try {
    await updateServiceType(req.body);
    res.status(204).send();
  } catch (err) {
    handleError(err, res);
  }
});

serviceTypeRouter.delete(
  "/serviceType/:id",
  async (req: Request, res: Response) => {
    try {
      await deactivateServiceType(Number(req.params.id));
      res.status(204).send();
    } catch (err) {
      handleError(err, res);
    }
  },
);
