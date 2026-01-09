import express from "express";
import { protectRoute, adminRoute } from "../middleware/auth.middleware.js";
import {
  getAllProducts,
  getFeaturerdProducts,
  createProduct,
  getRecommendedProducts,
  deleteProduct
} from "../Controller/product.controller.js";
const router = express.Router();

router.get("/", protectRoute, adminRoute, getAllProducts);
router.get("/featured", getFeaturerdProducts);
// router.get("/category/:category");
router.post("/", protectRoute, adminRoute, createProduct);
router.delete("/:id", protectRoute,adminRoute,deleteProduct)
// router.patch("/:id",protectRoute, adminRoute, toggleFeaturedProduct)
router.get("/recommendations",getRecommendedProducts)


export default router;
