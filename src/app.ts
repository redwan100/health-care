import cors from "cors";
import express, { Application, Request, Response } from "express";
import morgan from "morgan";
import { userRoute } from "./app/modules/User/user.routes";

const app: Application = express();

// ! PARSER
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.get("/", (req: Request, res: Response) => {
  res.send({
    message: "Hello, Health care zone!",
  });
});

app.use("/api/v1/user", userRoute);

export default app;
