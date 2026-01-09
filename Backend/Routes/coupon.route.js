import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getCoupons } from "../Controller/coupon.controller.js";

const router=express.Router();

router.get("/",protectRoute,getCoupons);

export default router;
