import request from "supertest";
import mongoose from "mongoose";

import app from "../app.js";
import Pet from "../models/Pet.js";

describe("Pets Router - Tests funcionales", () => {

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URL);
  });

  beforeEach(async () => {
    await Pet.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  test("GET /api/pets → debe devolver todas las mascotas", async () => {

    await Pet.create({
      name: "Beky",
      specie: "cat",
      birthDate: new Date()
    });

    const res = await request(app).get("/api/pets");

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe("success");
    expect(Array.isArray(res.body.payload)).toBe(true);
  });

  test("GET /api/pets/:id → debe devolver una mascota", async () => {

    const pet = await Pet.create({
      name: "Firulais",
      specie: "dog",
      birthDate: new Date()
    });

    const res = await request(app)
      .get(`/api/pets/${pet._id}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe("success");
    expect(res.body.payload._id).toBe(pet._id.toString());
  });

  test("GET /api/pets/:id → debe devolver 404 si no existe", async () => {

    const fakeId = new mongoose.Types.ObjectId();

    const res = await request(app)
      .get(`/api/pets/${fakeId}`);

    expect(res.statusCode).toBe(404);
    expect(res.body.status).toBe("error");
  });

  test("GET /api/pets/:id → debe fallar con ObjectId inválido", async () => {

    const res = await request(app).get("/api/pets/123");

    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe("error");
  });

  test("POST /api/pets → debe crear una mascota", async () => {

    const newPet = {
      name: "Luna",
      specie: "cat",
      birthDate: new Date()
    };

    const res = await request(app)
      .post("/api/pets")
      .send(newPet);

    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe("success");
    expect(res.body.payload._id).toBeDefined();
  });

  test("POST /api/pets → debe fallar si faltan datos", async () => {

    const res = await request(app)
      .post("/api/pets")
      .send({ name: "Luna" });

    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe("error");
  });

  test("PUT /api/pets/:id → debe actualizar una mascota", async () => {

    const pet = await Pet.create({
      name: "Firulais",
      specie: "dog",
      birthDate: new Date()
    });

    const res = await request(app)
      .put(`/api/pets/${pet._id}`)
      .send({ name: "Firulais Updated" });

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe("success");
    expect(res.body.payload.name).toBe("Firulais Updated");
  });

  test("PUT /api/pets/:id → debe devolver 404 si no existe", async () => {

    const fakeId = new mongoose.Types.ObjectId();

    const res = await request(app)
      .put(`/api/pets/${fakeId}`)
      .send({ name: "Test" });

    expect(res.statusCode).toBe(404);
    expect(res.body.status).toBe("error");
  });

  test("DELETE /api/pets/:id → debe eliminar una mascota", async () => {

    const pet = await Pet.create({
      name: "Luna",
      specie: "cat",
      birthDate: new Date()
    });

    const res = await request(app)
      .delete(`/api/pets/${pet._id}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe("success");

    const deleted = await Pet.findById(pet._id);
    expect(deleted).toBeNull();
  });

  test("DELETE /api/pets/:id → debe devolver 404 si no existe", async () => {

    const fakeId = new mongoose.Types.ObjectId();

    const res = await request(app)
      .delete(`/api/pets/${fakeId}`);

    expect(res.statusCode).toBe(404);
    expect(res.body.status).toBe("error");
  });

});