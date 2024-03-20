import cors from "cors";
import express, { Application, Request, Response } from "express";
import morgan from "morgan";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import notFound from "./app/middlewares/notFound";
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

// ! GLOBAL ERROR HANDLER
app.use(globalErrorHandler);

// ! NOT FOUND ERROR HANDLER
app.all("*", notFound);

export default app;
