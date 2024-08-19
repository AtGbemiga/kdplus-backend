import { Router } from "express";
import { createUserViaEmail } from "../api/create";
import { loginUserViaEmail } from "../api/login";

const router = Router();

router.post("/", createUserViaEmail);
router.post("/login", loginUserViaEmail);

export default router;
