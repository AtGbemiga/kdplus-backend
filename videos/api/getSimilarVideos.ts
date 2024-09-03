import express, { Request, Response, NextFunction } from "express";
import { AppError } from "../../lib/error";
import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { dynamoDB } from "../../db/dal";
export const vidsByCategory: express.RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return next(new AppError("Unauthorized", 401, "No token provided", true));
  }

  const { category } = req.query;

  if (!category) {
    return next(
      new AppError("Client error", 400, "Missing required category", true)
    );
  }

  const queryParams = {
    TableName: "Videos",
    IndexName: "category", // GSI name
    KeyConditionExpression: "category = :category",
    ExpressionAttributeValues: {
      ":category": category,
    },
    ProjectionExpression: "videoId, category, posterImageS3Key", // limit the fields returned
    Limit: 10, // limit the result returned to 10
  };

  try {
    const data = await dynamoDB.send(new QueryCommand(queryParams));

    if (!data.Items || data.Items.length === 0) {
      return next(new AppError("Not Found", 404, "No videos found", true));
    }

    const bucketUrl = `https://${process.env.AWS_BUCKET}.s3.amazonaws.com/`;

    // Map over Items to include the full URL for posterImageS3Key
    const updatedItems = data.Items.map((item) => ({
      ...item,
      posterUrl: `${bucketUrl}${item.posterImageS3Key}`,
    }));

    res.status(200).json({ status: "success", data: updatedItems });
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
