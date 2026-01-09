import express from "express"
import { protectRoute } from "../middleware/auth.middleware.js";


import { addTocart, getCartProducts, removeAllFromCart } from "../Controller/cart.controller.js";

const router=express.Router();



router.get("/",protectRoute,getCartProducts);
router.post("/",protectRoute, addTocart);
router.delete("/",protectRoute,removeAllFromCart)
// router.put("/:id",protectRoute,updateQunatity)


export default router;
