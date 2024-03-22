import express, { Request, Response } from "express";
import routes from "./src/routes/routes";
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(routes);

app.use("/uploads", express.static("uploads"));

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World");
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(routes);

app.use("/uploads", express.static("uploads"));

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World");
});

const port = process.env.PORT || 3000;

app.listen(Number(port), "0.0.0.0", function () {
  console.log(`Server is running on port ${port}`);
});
