import express from "express";

const router = express.Router();

router.get("/signup",signup);
});

router.get("/login", (req, res) => {
  res.send("Login Route");
});

export default router