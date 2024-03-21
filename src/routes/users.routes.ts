import { Router } from "express";
import controllers from "../controllers/users";
import JWT from "../middlewares/jwt.middlewares";
import Helper from "../helper/utils";

const router = Router()
  .post("/create", controllers.create)
  .get("/profile", JWT.verifyToken, controllers.profile)
  .get("/balance", JWT.verifyToken, controllers.getUserBalance)
  .put("/profile/update", JWT.verifyToken, controllers.updateProfile)
  .put(
    "/profile/image",
    JWT.verifyToken,
    Helper.upload.single("file"),
    controllers.updateImageProfile
  );

export default router;
