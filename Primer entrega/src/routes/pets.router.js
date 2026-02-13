import { Router } from "express";
import Pet from "../models/Pet.js";

const router = Router();

router.get("/", async (req, res) => {
  const pets = await Pet.find();
  res.json({ status: "success", payload: pets });
});

export default router;