import { Router } from "express";
import AuthController from "../controllers/auth";

const AuthRouter = Router().post("/login", AuthController.login);

export default AuthRouter;
