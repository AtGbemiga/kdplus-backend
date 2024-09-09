import express, { Request, Response, NextFunction } from "express";
import { AppError } from "../../../lib/error";
import { decodeUserEmail } from "../../auth/users/api/getUserEmail";
import { ReturnValue } from "@aws-sdk/client-dynamodb";
import { dynamoDB } from "../../../db/dal";
import { GetCommand, QueryCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { isVidInUserList } from "./isVidInUserList";

interface BodyProps {
  videoId: string;
  category: string;
}

export const addVidToList: express.RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return next(new AppError("Unauthorized", 401, "No token provided", true));
  }

  const { videoId, category }: BodyProps = req.body;

  if (!videoId || !category) {
    return next(
      new AppError("Client error", 400, "Missing required fields", true)
    );
  }

  try {
    // Use the utility function to check if the video is already in the list
    const videoExists = await isVidInUserList(req, next);

    if (videoExists) {
      return next(
        new AppError("Conflict", 409, "Video already exists in your list", true)
      );
    }

    // Get the user's email after validation in the utility
    const email = decodeUserEmail(req, null, next);

    // Add the video if it doesn't exist
    const updateParams = {
      TableName: "Users",
      Key: {
        email: email,
        acc_type: "email",
      },
      UpdateExpression:
        "SET user_list = list_append(if_not_exists(user_list, :empty_list), :new_item)",
      ExpressionAttributeValues: {
        ":new_item": [{ videoId: videoId, category: category }],
        ":empty_list": [],
      },
      ReturnValues: ReturnValue.UPDATED_NEW,
    };

    await dynamoDB.send(new UpdateCommand(updateParams));

    res.status(200).json({
      status: "success",
      message: "Video added to your list",
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
