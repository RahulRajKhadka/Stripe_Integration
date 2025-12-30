import express from "express";
import { signup } from "../Controller/auth.controller.js";
import { login } from "../Controller/auth.controller.js";

const router = express.Router();

router.get("/signup",signup);



export default router