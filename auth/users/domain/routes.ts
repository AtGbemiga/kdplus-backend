import { Router } from "express";
import { loginUserViaEmail } from "../api/login";
import { createOTP } from "../api/createOTP";
import { verifyOTP } from "../api/verifyOTP";
import { getUserEmail } from "../api/getUserEmail";

const router = Router();

router.post("/create-otp", createOTP);
router.post("/verify-otp", verifyOTP);
router.post("/login", loginUserViaEmail);
router.get("/get-user-email", getUserEmail);

export default router;
