import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";

import usersRouter from "./routes/users.router.js";
import petsRouter from "./routes/pets.router.js";
import mocksRouter from "./routes/mocks.router.js";
import adoptionRouter from "./routes/adoption.router.js";

import { swaggerUi, swaggerDocument } from "./docs/swagger.js";

dotenv.config();

const app = express();

app.use(express.json());

if (process.env.NODE_ENV !== "test") {
  connectDB();
}

app.use("/api/users", usersRouter);
app.use("/api/pets", petsRouter);
app.use("/api/mocks", mocksRouter);
app.use("/api/adoptions", adoptionRouter);

app.use(
  "/api/docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument)
);

app.get("/", (req, res) => {
  res.json({
    status: "success",
    message: "Pet Adoption API running"
  });
});

app.use((req, res) => {
  res.status(404).json({
    status: "error",
    message: "Ruta no encontrada"
  });
});

export default app;