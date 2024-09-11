import express, { Request, Response, NextFunction } from "express";
import { decodeUserEmail } from "../../auth/users/api/getUserEmail";
import { isVidInUserList } from "../../../utils/app/isVidInUserList";
import { AppError } from "../../../lib/error";
export const isVideoInUserList: express.RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { videoId }: { videoId: string } = req.body;

  if (!videoId) {
    return next(
      new AppError("Client error", 400, "Missing required videoId", true)
    );
  }
  try {
    const videoExists = await isVidInUserList(req, next);

    res.status(200).json({
      status: "success",
      message: videoExists ? true : false,
    });
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
