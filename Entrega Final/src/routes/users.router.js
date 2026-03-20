import { Router } from "express";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import mongoose from "mongoose";

const router = Router();

router.get("/", async (req, res) => {
  try {

    const users = await User.find().select("-password");

    res.status(200).json({
      status: "success",
      payload: users
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

    const { first_name, last_name, email, password, age } = req.body;

    if (!first_name || !last_name || !email || !password) {
      return res.status(400).json({
        status: "error",
        message: "Faltan datos obligatorios"
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        status: "error",
        message: "Email ya registrado"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      first_name,
      last_name,
      email,
      password: hashedPassword,
      age
    });

    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(201).json({
      status: "success",
      payload: userResponse
    });

  } catch (error) {

    res.status(500).json({
      status: "error",
      message: error.message
    });

  }

});

router.get("/:uid", async (req, res) => {

  try {

    const { uid } = req.params;

    if (!mongoose.Types.ObjectId.isValid(uid)) {
      return res.status(400).json({
        status: "error",
        message: "ObjectId inválido"
      });
    }

    const user = await User.findById(uid).select("-password");

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "Usuario no encontrado"
      });
    }

    res.status(200).json({
      status: "success",
      payload: user
    });

  } catch (error) {

    res.status(500).json({
      status: "error",
      message: error.message
    });

  }

});

router.delete("/:uid", async (req, res) => {

  try {

    const { uid } = req.params;

    if (!mongoose.Types.ObjectId.isValid(uid)) {
      return res.status(400).json({
        status: "error",
        message: "ObjectId inválido"
      });
    }

    const deleted = await User.findByIdAndDelete(uid);

    if (!deleted) {
      return res.status(404).json({
        status: "error",
        message: "Usuario no encontrado"
      });
    }

    res.status(200).json({
      status: "success",
      message: "Usuario eliminado correctamente"
    });

  } catch (error) {

    res.status(500).json({
      status: "error",
      message: error.message
    });

  }

});

export default router;