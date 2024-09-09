import express, { Request, Response, NextFunction } from "express";
import { dynamoDB } from "../../db/dal";
import { ScanCommand } from "@aws-sdk/lib-dynamodb";
import { AppError } from "../../lib/error";
import { bucketUrl } from "../../utils/constants/s3url";

export const vidLimitedInfo: express.RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // check for token
    // const token = req.headers.authorization?.split(" ")[1];
    // if (!token) {
    //   return next(new AppError("Unauthorized", 401, "No token provided", true));
    // }

    // Scan the DynamoDB table to get all videos
    const { Items } = await dynamoDB.send(
      new ScanCommand({ TableName: "Videos" })
    );

    if (!Items) {
      return next(
        new AppError("No videos found", 404, "No videos found", true)
      );
    }

    // Organize videos by category
    const categoriesMap: {
      [key: string]: {
        videoId: string;
        posterKey: string;
      }[];
    } = {};

    Items.forEach((item) => {
      const category = item.category || "uncategorized";
      const posterKey = item.posterImageS3Key;
      const videoId = item.videoId;

      // Initialize category array if it doesn't exist
      if (!categoriesMap[category]) {
        categoriesMap[category] = [];
      }

      // Push the video ID and poster key into the corresponding category
      categoriesMap[category].push({
        videoId,
        posterKey,
      });
    });

    // Transform the categoriesMap into the desired format, limiting data items to 10 per category
    const homeVidOptions = Object.entries(categoriesMap).map(
      ([header, data]) => ({
        header,
        data: data.slice(0, 10).map(({ videoId, posterKey }) => ({
          id: videoId,
          posterUrl: `${bucketUrl}${posterKey}`,
        })),
      })
    );

    res.status(200).json({
      data: homeVidOptions,
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
