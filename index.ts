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

// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   limit: 100,
//   standardHeaders: "draft-7",
//   legacyHeaders: false,
// });

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(limiter);

import userRouter from "./app/auth/email/domain/routes";
import payStackRouter from "./app/payment/paystack/domain/routes";
import planRouter from "./app/plans/domain/routes";
import videoRouter from "./app/videos/domain/routes";
import { APIVERSION } from "./lib/constants/apiVersion";
import { verifyToken } from "./utils/middleware/token/checkToken";

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.use(`${APIVERSION}/users`, userRouter);
app.use(`${APIVERSION}/paystack`, payStackRouter);
app.use(`${APIVERSION}/plans`, planRouter);
app.use(`${APIVERSION}/videos`, verifyToken, videoRouter);

app.use(errorHandler);

// process.on("unhandledRejection", (reason, p) => {
//   logger.error("Unhandled Rejection:", reason);
//   throw reason;
// });

// process.on("uncaughtException", (error) => {
//   logger.error("Uncaught Exception:", error);

//   if (!errorHandler.isTrustedError(error)) {
//     logger.error("Exiting due to untrusted error.");
//     process.exit(1);
//   }
// });

server.listen(4192, () => {
  console.log("Server started on port 4192");
});
