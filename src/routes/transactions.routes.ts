import { Router } from "express";
import JWT from "../middlewares/jwt.middlewares";
import TransactionsController from "../controllers/transactions";

const TransactionsRoute = Router()
  .post("/topup", JWT.verifyToken, TransactionsController.topUp)
  .post("/transaction", JWT.verifyToken, TransactionsController.transaction)
  .get(
    "/transaction/history",
    JWT.verifyToken,
    TransactionsController.transactionHistory
  );

export default TransactionsRoute;
