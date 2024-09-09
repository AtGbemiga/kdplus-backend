import { Router } from "express";
import { uploadVideo } from "../api/uploadVid";
import { vidLimitedInfo } from "../api/getVidLimitedInfo";
import { vidsByCategory } from "../api/getSimilarVideos";
import { getCasts } from "../api/getVideoCasts";
import { uploadVidCast } from "../api/uploadVidCast";
import { streamVideo } from "../api/streamVideo";
import { addVidToList } from "../api/addVidToList";

const router = Router();

router.post("/upload-video", uploadVideo);
router.get("/video-options", vidLimitedInfo);
router.get("/similar-videos", vidsByCategory);
router.get("/casts", getCasts);
router.post("/upload-cast", uploadVidCast);
router.get("/stream-video", streamVideo);
router.post("/add-video-to-list", addVidToList);

export default router;
