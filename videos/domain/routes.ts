import { Router } from "express";
import { uploadVideo } from "../api/uploadVid";

const router = Router();

router.post("/upload-video", uploadVideo);

export default router;
