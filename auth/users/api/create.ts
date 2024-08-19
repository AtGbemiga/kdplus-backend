import express, { NextFunction, Request, Response } from "express";
import { dynamoDB } from "../../../db/dal";
import { GetCommand, PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { AppError } from "../../../lib/error";
import {
  generateSalt,
  hashPassword,
} from "../../../middleware/bcrypt/bcryptUtils";

interface BodyProps {
  username: string;
  email: string;
  password: string;
}

// TODO: centralized error handling

export const createUserViaEmail: express.RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username, email, password }: BodyProps = req.body;

  if (!username || !email || !password) {
    return next(
      new AppError("Invalid input", 400, "Missing required fields", true)
    );
  }

  const queryParams = {
    TableName: "Users",
    KeyConditionExpression: "email = :email AND acc_type = :acc_type",
    ExpressionAttributeValues: {
      ":email": email,
      ":acc_type": "email",
    },
  };

  try {
    const data = await dynamoDB.send(new QueryCommand(queryParams));

    if (data.Items && data.Items.length > 0) {
      return next(
        new AppError("Duplicate email", 400, "Email already exists", true)
      );
    }

    const saltRounds = 10;
    const salt = await generateSalt(saltRounds);
    const hash = await hashPassword(password, salt);

    const putParams = {
      TableName: "Users",
      Item: {
        email: email,
        acc_type: "email",
        username: username,
        password: hash,
      },
    };

    await dynamoDB.send(new PutCommand(putParams));

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    return next(
      new AppError(
        "Failed to create user",
        500,
        (error as Error).message + "Please try again later",
        true
      )
    );
  }
};
