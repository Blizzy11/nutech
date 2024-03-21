import { Router } from "express";
import JWT from "../middlewares/jwt.middlewares";
import ServicesController from "../controllers/services";

const ServicesRouter = Router().get(
  "/",
  JWT.verifyToken,
  ServicesController.getAll
);

export default ServicesRouter;
