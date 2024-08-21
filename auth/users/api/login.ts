import { QueryCommand } from "@aws-sdk/client-dynamodb";
import express, { NextFunction, Request, Response } from "express";
import { dynamoDB } from "../../../db/dal";
import { AppError } from "../../../lib/error";
import { comparePassword } from "../../../middleware/bcrypt/bcryptUtils";
import { jwtGenerateToken } from "../../../middleware/jwt/jwt";
import { setToken } from "../../../middleware/jwt/setToken";

interface BodyProps {
  email: string;
  password: string;
}

export const loginUserViaEmail: express.RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password }: BodyProps = req.body;

  if (!email || !password) {
    return next(
      new AppError("Invalid input", 400, "Missing required fields", true)
    );
  }
  const queryParams = {
    TableName: "Users",
    KeyConditionExpression: "email = :email AND acc_type = :acc_type",
    ExpressionAttributeValues: {
      ":email": { S: email }, // Use AttributeValue type
      ":acc_type": { S: "email" }, // Use AttributeValue type
    },
  };
  try {
    const data = await dynamoDB.send(new QueryCommand(queryParams));

    if (!data.Items || data.Items.length === 0) {
      return next(
        new AppError(
          "User not found",
          404,
          "No user found with this email",
          true
        )
      );
    }

    console.log(data.Items);

    const storedPassword = data.Items[0].password.S;
    console.log("userPassword", storedPassword);

    if (!storedPassword) {
      return next(
        new AppError("Invalid credentials", 401, "Invalid credentials", true)
      );
    }

    comparePassword(password, storedPassword).then((isMatch) => {
      if (!isMatch) {
        return next(
          new AppError("Invalid credentials", 401, "Invalid credentials", true)
        );
      }

      const token = jwtGenerateToken(email);

      setToken(req, res, token);

      res.status(200).json({ message: "Login successful", token });
    });
  } catch (error) {
    console.error(error);
    return next(
      new AppError(
        "Internal Server Error",
        500,
        "Failed to retrieve user data",
        true
      )
    );
  }
};
