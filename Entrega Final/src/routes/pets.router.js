import { Router } from "express";
import Pet from "../models/Pet.js";
import mongoose from "mongoose";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const pets = await Pet.find();

    res.status(200).json({
      status: "success",
      payload: pets
    });

  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message
    });
  }
});

router.get("/:pid", async (req, res) => {
  try {

    const { pid } = req.params;

    if (!mongoose.Types.ObjectId.isValid(pid)) {
      return res.status(400).json({
        status: "error",
        message: "ObjectId inválido"
      });
    }

    const pet = await Pet.findById(pid);

    if (!pet) {
      return res.status(404).json({
        status: "error",
        message: "Mascota no encontrada"
      });
    }

    res.status(200).json({
      status: "success",
      payload: pet
    });

  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message
    });
  }
});

router.post("/", async (req, res) => {
  try {

    const { name, specie, birthDate } = req.body;

    if (!name || !specie || !birthDate) {
      return res.status(400).json({
        status: "error",
        message: "Faltan datos obligatorios"
      });
    }

    const pet = await Pet.create({
      name,
      specie,
      birthDate
    });

    res.status(201).json({
      status: "success",
      payload: pet
    });

  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message
    });
  }
});

router.put("/:pid", async (req, res) => {
  try {

    const { pid } = req.params;

    if (!mongoose.Types.ObjectId.isValid(pid)) {
      return res.status(400).json({
        status: "error",
        message: "ObjectId inválido"
      });
    }

    const updated = await Pet.findByIdAndUpdate(
      pid,
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({
        status: "error",
        message: "Mascota no encontrada"
      });
    }

    res.status(200).json({
      status: "success",
      payload: updated
    });

  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message
    });
  }
});

router.delete("/:pid", async (req, res) => {
  try {

    const { pid } = req.params;

    if (!mongoose.Types.ObjectId.isValid(pid)) {
      return res.status(400).json({
        status: "error",
        message: "ObjectId inválido"
      });
    }

    const deleted = await Pet.findByIdAndDelete(pid);

    if (!deleted) {
      return res.status(404).json({
        status: "error",
        message: "Mascota no encontrada"
      });
    }

    res.status(200).json({
      status: "success",
      message: "Mascota eliminada correctamente"
    });

  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message
    });
  }
});

export default router;