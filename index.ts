import express, { Request, Response } from "express";
import routes from "./src/routes/routes";
import dotenv from "dotenv";
dotenv.config();
const app = express();

const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;

app.listen(port, "0.0.0.0", function () {
  console.log(`Server is running on port ${port}`);
});
