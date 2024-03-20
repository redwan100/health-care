import cors from "cors";
import express, { Application, Request, Response } from "express";
import httpStatus from "http-status";
import morgan from "morgan";
import router from "./app/routes";

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

app.use("/api/v1", router);

app.all("*", (req, res) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: "Not Found",
  });
});

export default app;
