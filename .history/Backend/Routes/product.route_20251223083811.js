import express from "express"
import { protectRoute,adminRoute } from "../middleware/auth.middleware.js";
import {getAllProducts,getFeaturerdProducts} from "../Controller/product.controller.js"
const router =express.Router();

router.get("/",protectRoute,adminRoute,getAllProducts);
router.get("/featured",getFeaturerdProducts);

export default router;