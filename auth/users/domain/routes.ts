import { Router } from "express";
import { loginUserViaEmail } from "../api/login";
import { createOTP } from "../api/createOTP";
import { verifyOTP } from "../api/verifyOTP";

const router = Router();

router.post("/create-otp", createOTP);
router.post("/verify-otp", verifyOTP);
router.post("/login", loginUserViaEmail);

export default router;
