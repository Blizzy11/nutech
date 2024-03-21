import { Router } from "express";
import usersRoutes from "./users.routes";
import AuthRouter from "./auth.routes";
import BannersRouter from "./banners.routes";
import ServicesRouter from "./services.routes";
import TransactionsRoute from "./transactions.routes";

const api = Router()
  .use("/users", usersRoutes)
  .use("/auth", AuthRouter)
  .use("/banners", BannersRouter)
  .use("/services", ServicesRouter)
  .use("", TransactionsRoute);

export default Router().use("/v1/api", api);
