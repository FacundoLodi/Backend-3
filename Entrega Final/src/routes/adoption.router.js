import express from "express";
import Adoption from "../models/Adoption.js";
import User from "../models/User.js";
import Pet from "../models/Pet.js";
import mongoose from "mongoose";

const router = express.Router();

router.post("/", async (req, res) => {

  const session = await mongoose.startSession();
  session.startTransaction();

  try {

    const { userId, petId } = req.body;

    if (!userId || !petId) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        status: "error",
        message: "Faltan datos"
      });
    }

    if (
      !mongoose.Types.ObjectId.isValid(userId) ||
      !mongoose.Types.ObjectId.isValid(petId)
    ) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        status: "error",
        message: "ObjectId inválido"
      });
    }

    const user = await User.findById(userId).session(session);
    const pet = await Pet.findById(petId).session(session);

    if (!user || !pet) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({
        status: "error",
        message: "Usuario o mascota no encontrados"
      });
    }

    if (pet.adopted) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        status: "error",
        message: "La mascota ya fue adoptada"
      });
    }

    const adoption = await Adoption.create([{
      user: user._id,
      pet: pet._id
    }], { session });

    pet.adopted = true;
    await pet.save({ session });

    user.pets.push(pet._id);
    await user.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      status: "success",
      payload: adoption[0]
    });

  } catch (error) {

    await session.abortTransaction();
    session.endSession();

    res.status(500).json({
      status: "error",
      message: error.message
    });

  }
});


router.get("/", async (req, res) => {

  try {

    const adoptions = await Adoption.find()
      .populate("user", "email")
      .populate("pet", "name");

    res.status(200).json({
      status: "success",
      payload: adoptions
    });

  } catch (error) {

    res.status(500).json({
      status: "error",
      message: error.message
    });

  }

});


router.get("/:aid", async (req, res) => {

  try {

    const { aid } = req.params;

    if (!mongoose.Types.ObjectId.isValid(aid)) {
      return res.status(400).json({
        status: "error",
        message: "ObjectId inválido"
      });
    }

    const adoption = await Adoption.findById(aid)
      .populate("user", "email")
      .populate("pet", "name");

    if (!adoption) {
      return res.status(404).json({
        status: "error",
        message: "Adopción no encontrada"
      });
    }

    res.status(200).json({
      status: "success",
      payload: adoption
    });

  } catch (error) {

    res.status(500).json({
      status: "error",
      message: error.message
    });

  }

});

export default router;