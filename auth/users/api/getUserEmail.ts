import express, { Request, Response, NextFunction } from "express";
import { AppError } from "../../../lib/error";
import jwt from "jsonwebtoken";

export const decodeUserEmail = (
  req: Request,
  _: any,
  next: NextFunction
): string => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    throw new AppError("Unauthorized", 401, "No token provided", true);
  }

  try {
    // Decode the token to get the email
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    const { email } = decoded as { email: string };
    return email;
  } catch (error) {
    // Throw the error so it can be caught by the calling function
    next(
      new AppError(
        "Internal server error",
        500,
        (error as Error).message + " Please try again later",
        true
      )
    );
    throw error; // Add this line to stop the function and indicate an error occurred
  }
};

export const getUserEmail: express.RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const email = decodeUserEmail(req, null, next);

    // This check is unnecessary since decodeUserEmail throws an error if the token is invalid
    // But it won't hurt to keep it for clarity
    if (!email) {
      return next(new AppError("Unauthorized", 401, "No token provided", true));
    }

    return res.status(200).json({ email });
  } catch (error) {
    // Any errors will be caught here and passed to the next middleware
    return next(
      new AppError(
        "Internal server error",
        500,
        (error as Error).message + " Please try again later",
        true
      )
    );
  }
};
