import { Router } from "express";
import { createUserViaEmail } from "../api/create";

const router = Router();

router.post("/", createUserViaEmail);

export default router;
