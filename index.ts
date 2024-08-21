import express, { Request, Response } from "express";
import cors from "cors";
import "dotenv/config";
import helmet from "helmet";
import http from "http";
import { rateLimit } from "express-rate-limit";
import { errorHandler } from "./lib/error";

const app = express();
const server = http.createServer(app);
app.set("trust proxy", 1); // Trust the first proxy

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: "draft-7",
  legacyHeaders: false,
});

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(limiter);

import userRouter from "./auth/users/domain/routes";

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.use("/api/v1/users", userRouter);

app.use(errorHandler);

// process.on("unhandledRejection", (reason, p) => {
//   // I just caught an unhandled promise rejection,
//   console.error("err0");
//   // since we already have fallback handler for unhandled errors (see below),
//   // let throw and let him handle that
//   throw reason;
// });

// process.on("uncaughtException", (error) => {
//   console.error("Uncaught Exception:", error);

//   // Here, you should directly use the errorHandler function or call your own method
//   // For example, log the error or handle it in some way
//   if (!errorHandler.isTrustedError(error)) {
//     console.error("Exiting due to untrusted error.");
//     process.exit(1);
//   }
// });

server.listen(4192, () => {
  console.log("Server started on port 4192");
});
