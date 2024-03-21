import { Router } from "express";
import JWT from "../middlewares/jwt.middlewares";
import BannersController from "../controllers/banners";

const BannersRouter = Router().get(
  "/",
  JWT.verifyToken,
  BannersController.getAllBanners
);

export default BannersRouter;
