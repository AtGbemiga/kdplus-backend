import { ReturnValue } from "@aws-sdk/client-dynamodb";
import { GetCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import express, { NextFunction, Request, Response } from "express";
import { dynamoDB } from "../../../db/dal";
import { AppError } from "../../../lib/error";
import { decodeUserEmail } from "../../auth/users/api/getUserEmail";

interface BodyProps {
  videoId: string;
  category: string;
  rating: string;
}

export const addVidRating: express.RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { videoId, category, rating }: BodyProps = req.body;

  if (!videoId || !category || !rating) {
    return next(
      new AppError("Client error", 400, "Missing required fields", true)
    );
  }

  try {
    // Get the user's email after validation in the utility
    const email = decodeUserEmail(req, null, next);

    // Check if the rating already exists
    const getParams = {
      TableName: "Users",
      Key: {
        email: email,
        acc_type: "email",
      },
      ProjectionExpression: "user_video_rating",
    };

    const { Item } = await dynamoDB.send(new GetCommand(getParams));

    const existingRatings = Item?.user_video_rating || [];

    // Check if the videoId and category already have a rating
    const ratingExists = existingRatings.some(
      (item: { videoId: string; category: string }) =>
        item.videoId === videoId && item.category === category
    );

    if (ratingExists) {
      return next(
        new AppError("Client error", 400, "Rating already exists", true)
      );
    }

    // Add the video rating if it doesn't exist
    const updateParams = {
      TableName: "Users",
      Key: {
        email: email,
        acc_type: "email",
      },
      UpdateExpression:
        "SET user_video_rating = list_append(if_not_exists(user_video_rating, :empty_list), :new_item)",
      ExpressionAttributeValues: {
        ":new_item": [{ videoId, category, rating }],
        ":empty_list": [],
      },
      ReturnValues: ReturnValue.UPDATED_NEW,
    };

    await dynamoDB.send(new UpdateCommand(updateParams));

    res.status(200).json({
      status: "success",
      message: "Video rating added",
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
