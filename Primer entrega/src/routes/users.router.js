import { Router } from "express";
import User from "../models/User.js";

const router = Router();

router.get("/", async (req, res) => {
  const users = await User.find();
  res.json({ status: "success", payload: users });
});

export default router;