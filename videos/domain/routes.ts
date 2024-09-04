import { Router } from "express";
import { uploadVideo } from "../api/uploadVid";
import { vidLimitedInfo } from "../api/getVidLimitedInfo";
import { vidsByCategory } from "../api/getSimilarVideos";
import { getCasts } from "../api/getVideoCasts";
import { uploadVidCast } from "../api/uploadVidCast";

const router = Router();

router.post("/upload-video", uploadVideo);
router.get("/video-options", vidLimitedInfo);
router.get("/similar-videos", vidsByCategory);
router.get("/casts", getCasts);
router.post("/upload-cast", uploadVidCast);

export default router;
