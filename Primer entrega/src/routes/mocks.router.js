import { Router } from "express";
import { generateMockUsers } from "../mocks/user.mock.js";
import { generateMockPets } from "../mocks/pet.mock.js";
import User from "../models/User.js";
import Pet from "../models/Pet.js";

const router = Router();

router.get("/mockingpets", (req, res) => {
  const pets = generateMockPets(20);
  res.json({ status: "success", payload: pets });
});

router.get("/mockingusers", async (req, res) => {
  const users = await generateMockUsers(50);
  res.json({ status: "success", payload: users });
});

router.post("/generateData", async (req, res) => {
  try {
    const { users = 0, pets = 0 } = req.body;

    const mockUsers = await generateMockUsers(Number(users));
    const mockPets = generateMockPets(Number(pets));

    await User.insertMany(mockUsers);
    await Pet.insertMany(mockPets);

    res.json({
      status: "success",
      message: `Inserted ${users} users and ${pets} pets`
    });
  } catch (error) {
    res.status(500).json({ status: "error", error: error.message });
  }
});

export default router;