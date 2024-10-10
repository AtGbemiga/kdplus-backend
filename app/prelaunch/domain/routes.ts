import { Router } from "express";
import { registerUser } from "../api/register";
import { stripeSubscription } from "../api/stripe";
const router = Router();

router.post("/register", registerUser);
router.post("/stripe-subscription", stripeSubscription);

export default router;
