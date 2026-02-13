import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";

import usersRouter from "./routes/users.router.js";
import petsRouter from "./routes/pets.router.js";
import mocksRouter from "./routes/mocks.router.js";

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

app.use("/api/users", usersRouter);
app.use("/api/pets", petsRouter);
app.use("/api/mocks", mocksRouter);

app.listen(8080, () => console.log("Servidor corriendo en puerto 8080"));