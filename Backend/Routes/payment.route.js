import express from "express";
import Stripe from "stripe";
import {protectRoute} from "../middleware/auth.middleware.js";
import Coupon from "../models/coupon.model.js";
import {
  checkoutSuccess,
  createCheckoutSession,
} from "../Controller/payment.controller.js";
import { stripe } from "../lib/stripe.js";

const router = express.Router();

router.post("/create-checkout-session", protectRoute, createCheckoutSession);
router.post("/create-checkout-sucess", protectRoute, checkoutSuccess);

export default router