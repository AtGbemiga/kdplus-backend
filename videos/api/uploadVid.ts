import express, { Request, Response, NextFunction } from "express";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import multer from "multer";
import { AppError } from "../../lib/error";

const s3 = new S3Client({
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
});

const upload = multer({
  storage: multer.memoryStorage(),
});

export const uploadVideo: express.RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  upload.single("video")(req, res, async (error) => {
    try {
      // Assuming 'video' is the field name in the form-data
      const videoFile = req.file;

      if (!videoFile) {
        return next(
          new AppError("No file uploaded", 400, "Upload a file", true)
        );
      }

      const videoKey = `${Date.now()}-${videoFile.originalname}`;

      // Upload to S3
      const uploadParams = {
        Bucket: process.env.AWS_BUCKET as string,
        Key: videoKey,
        Body: videoFile.buffer,
        ContentType: videoFile.mimetype,
      };

      await s3.send(new PutObjectCommand(uploadParams));

      res
        .status(200)
        .json({ status: "success", message: "Video uploaded successfully" });
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
  });
};
