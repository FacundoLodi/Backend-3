import request from "supertest";
import mongoose from "mongoose";

import app from "../app.js";
import User from "../models/User.js";
import Pet from "../models/Pet.js";
import Adoption from "../models/Adoption.js";

describe("Adoption Router - Tests Funcionales", () => {

  let user;
  let pet;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URL);
  });

  beforeEach(async () => {

    await Adoption.deleteMany({});
    await User.deleteMany({});
    await Pet.deleteMany({});

    user = await User.create({
      first_name: "Facundo",
      last_name: "Lodi",
      email: "FacundoLodi@test.com",
      age: 24,
      password: "123456E",
      role: "user",
      pets: []
    });

    pet = await Pet.create({
      name: "Beky",
      specie: "cat",
      birthDate: new Date(),
      adopted: false
    });

  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  test("POST /api/adoptions → debe crear una adopción correctamente", async () => {

    const res = await request(app)
      .post("/api/adoptions")
      .send({
        userId: user._id,
        petId: pet._id
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe("success");

    expect(res.body.payload).toHaveProperty("_id");
    expect(res.body.payload).toHaveProperty("user");
    expect(res.body.payload).toHaveProperty("pet");

    expect(res.body.payload.user.toString()).toBe(user._id.toString());
    expect(res.body.payload.pet.toString()).toBe(pet._id.toString());

    const updatedUser = await User.findById(user._id);
    expect(updatedUser.pets.length).toBe(1);

    const updatedPet = await Pet.findById(pet._id);
    expect(updatedPet.adopted).toBe(true);
  });

  test("POST /api/adoptions → debe fallar si el usuario no existe", async () => {

    const fakeId = new mongoose.Types.ObjectId();

    const res = await request(app)
      .post("/api/adoptions")
      .send({
        userId: fakeId,
        petId: pet._id
      });

    expect(res.statusCode).toBe(404);
    expect(res.body.status).toBe("error");
    expect(res.body.message).toBe("Usuario o mascota no encontrados");
  });

  test("POST /api/adoptions → debe fallar si la mascota no existe", async () => {

    const fakeId = new mongoose.Types.ObjectId();

    const res = await request(app)
      .post("/api/adoptions")
      .send({
        userId: user._id,
        petId: fakeId
      });

    expect(res.statusCode).toBe(404);
    expect(res.body.status).toBe("error");
    expect(res.body.message).toBe("Usuario o mascota no encontrados");
  });

  test("POST /api/adoptions → debe fallar si la mascota ya fue adoptada", async () => {

    await Adoption.create({
      user: user._id,
      pet: pet._id
    });

    await Pet.findByIdAndUpdate(pet._id, { adopted: true });

    const res = await request(app)
      .post("/api/adoptions")
      .send({
        userId: user._id,
        petId: pet._id
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe("error");
    expect(res.body.message).toBe("La mascota ya fue adoptada");
  });

  test("POST /api/adoptions → debe fallar si el body está vacío", async () => {

    const res = await request(app)
      .post("/api/adoptions")
      .send({});

    expect(res.statusCode).toBeGreaterThanOrEqual(400);
    expect(res.body.status).toBe("error");
  });

  test("POST /api/adoptions → debe fallar con ObjectId inválido", async () => {

    const res = await request(app)
      .post("/api/adoptions")
      .send({
        userId: "invalidId",
        petId: "invalidId"
      });

    expect(res.statusCode).toBeGreaterThanOrEqual(400);
  });

  test("GET /api/adoptions → debe devolver todas las adopciones", async () => {

    await Adoption.create({
      user: user._id,
      pet: pet._id
    });

    const res = await request(app).get("/api/adoptions");

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe("success");

    expect(Array.isArray(res.body.payload)).toBe(true);
    expect(res.body.payload.length).toBeGreaterThan(0);

    const adoption = res.body.payload[0];

    expect(adoption).toHaveProperty("_id");
    expect(adoption).toHaveProperty("user");
    expect(adoption).toHaveProperty("pet");

    expect(adoption.user).toHaveProperty("_id");
    expect(adoption.user).toHaveProperty("email");

    expect(adoption.pet).toHaveProperty("_id");
    expect(adoption.pet).toHaveProperty("name");
  });

  test("GET /api/adoptions → debe devolver array vacío si no hay adopciones", async () => {

    const res = await request(app).get("/api/adoptions");

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe("success");
    expect(Array.isArray(res.body.payload)).toBe(true);
    expect(res.body.payload.length).toBe(0);
  });

  test("GET /api/adoptions/:id → debe devolver una adopción por id", async () => {

    const adoption = await Adoption.create({
      user: user._id,
      pet: pet._id
    });

    const res = await request(app)
      .get(`/api/adoptions/${adoption._id}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe("success");

    expect(res.body.payload._id).toBe(adoption._id.toString());
  });

  test("GET /api/adoptions/:id → debe fallar con ObjectId inválido", async () => {

    const res = await request(app)
      .get("/api/adoptions/123");

    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe("error");
  });

  test("GET ruta inválida → debe devolver 404", async () => {

    const res = await request(app).get("/api/routeThatDoesNotExist");

    expect(res.statusCode).toBe(404);
  });

});