import express from "express";
import { signup } from "../Controller/auth.controller.js";

const router = express.Router(); // Make sure this is express.Router()

router.post("/signup", signup);

export default router;