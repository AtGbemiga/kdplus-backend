import express, { Request, Response, NextFunction } from "express";
import { AppError } from "../../../lib/error";
import jwt from "jsonwebtoken";
export const getUserEmail: express.RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return next(new AppError("Unauthorized", 401, "No token provided", true));
  }

  try {
    // decode the token to get the email
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    const { email } = decoded as { email: string };
    return res.status(200).json({ email });
  } catch (error) {
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
