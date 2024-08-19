import express, { Request, Response } from "express";
import cors from "cors";
import "dotenv/config";
import helmet from "helmet";
import http from "http";
import { dynamoDB } from "./db/dal";
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { rateLimit } from "express-rate-limit";
import { errorHandler } from "./lib/error";

const app = express();
const server = http.createServer(app);

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

// app.post("/add", async (req: Request, res: Response) => {
//   const params = {
//     TableName: "YourTableName",
//     Item: {
//       PrimaryKey: "dooo",
//       AnotherAttribute: 3456,
//     },
//   };

//   dynamoDB
//     .send(new PutCommand(params))
//     .then(() => res.send("Item added successfully"))
//     .catch((err) => console.error(err));
// });

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.use("/api/v1/users", userRouter);

app.use(errorHandler);

server.listen(4192, () => {
  console.log("Server started on port 4192");
});
