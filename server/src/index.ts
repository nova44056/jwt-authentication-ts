import "reflect-metadata";
import * as dotenv from "dotenv";
import { createConnection } from "typeorm";
import express from "express";
import { routes } from "./routes";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
(async () => {
  const app = express();
  dotenv.config({ path: __dirname + "/.env" });
  app.use(express.json());
  app.use(
    cors({
      credentials: true,
      origin: ["http://localhost:3000"],
    })
  );
  app.use(cookieParser());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(routes);
  await createConnection();
  app.listen(process.env.PORT, () => {
    console.log(`Server running at http://localhost:${process.env.PORT}`);
  });
})();
