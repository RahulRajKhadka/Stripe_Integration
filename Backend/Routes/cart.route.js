import express from "express"
import { protectRoute } from "../middleware/auth.middleware";

const router=express.Router();



router.get("/",protectRoute,getCartProducts);
router.post("/",protectRoute, addCart);
router.delete("/",protectRoute,removeFromCart)
router.put("/:id",protectRoute,updateQunatity)


export default router;
