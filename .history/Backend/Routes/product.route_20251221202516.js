import express from "express"
import { protectRoute } from "../middleware/auth.middleware";
import {getAllProducts}
const router =express.Router();

router.get("/",protectRoute,adminRoute,getAllProducts);
export default router;