import express, { Request, Response, NextFunction } from "express";
export const cancel: express.RequestHandler = async (
  _: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(200).json({ success: "true" });
};
