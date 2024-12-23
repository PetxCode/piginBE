import express, { Application, Request, Response } from "express";
import { mainApp } from "./main";
import { dbConfig } from "./utils/dbConfig";
import cors from "cors";
const app: Application = express();

app.use(express.json());
app.use(cors());

mainApp(app);
const server = app.listen(process.env.PORT, () => {
  console.clear();
  console.log();
  dbConfig();
});

process.on("uncaughtException", (error: Error) => {
  console.log("uncaughtException: ", error);

  process.exit(1);
});

process.on("unhandledRejection", (reason: any) => {
  console.log("unhandledRejection: ", reason);

  server.close(() => {
    process.exit(1);
  });
});
