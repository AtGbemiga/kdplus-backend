import { Router } from "express";
import { uploadVideo } from "../api/uploadVid";
import { vidLimitedInfo } from "../api/getVidLimitedInfo";
import { vidsByCategory } from "../api/getSimilarVideos";

const router = Router();

router.post("/upload-video", uploadVideo);
router.get("/video-options", vidLimitedInfo);
router.get("/similar-videos", vidsByCategory);

export default router;
