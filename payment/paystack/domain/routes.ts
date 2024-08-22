import { Router } from "express";
import { callBack } from "../api/callBack";
import { oneMonth } from "../api/plans";

const router = Router();

router.get("/payment", oneMonth);
router.get("/callbackurl", callBack);

export default router;
