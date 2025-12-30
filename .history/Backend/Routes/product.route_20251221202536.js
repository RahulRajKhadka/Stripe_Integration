import express from "express"
import { protectRoute } from "../middleware/auth.middleware";
import {getAllProducts} from "../Controller/product.controller.js"
const router =express.Router();

router.get("/",protectRoute,adminRoute,getAllProducts);
export default router;