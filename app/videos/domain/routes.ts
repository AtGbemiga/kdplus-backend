import { Router } from "express";
import { uploadVideo } from "../api/uploadVid";
import { vidLimitedInfo } from "../api/getVidLimitedInfo";
import { vidsByCategory } from "../api/getSimilarVideos";
import { getCasts } from "../api/getVideoCasts";
import { uploadVidCast } from "../api/uploadVidCast";
import { streamVideo } from "../api/streamVideo";
import { addVidToList } from "../api/addVidToList";
import { isVideoInUserList } from "../api/isVideoInUsersList";
import { deleteVidFromList } from "../api/deleteVidFromList";
import { getUserListVids } from "../api/getVidsInUserList";

const router = Router();

router.post("/upload-video", uploadVideo);
router.get("/video-options", vidLimitedInfo);
router.get("/similar-videos", vidsByCategory);
router.get("/casts", getCasts); 
router.post("/upload-cast", uploadVidCast);
router.get("/stream-video", streamVideo);
router.post("/add-video-to-list", addVidToList);
router.post("/is-video-in-users-list", isVideoInUserList);
router.delete("/delete-video-from-list", deleteVidFromList);
router.get("/get-videos-in-user-list", getUserListVids);

export default router;
