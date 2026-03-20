import request from "supertest";
import mongoose from "mongoose";

import app from "../app.js";
import User from "../models/User.js";
import Pet from "../models/Pet.js";

describe("Mocks Router - Tests funcionales", () => {

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URL);
  });

  beforeEach(async () => {
    await User.deleteMany({});
    await Pet.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  test("GET /api/mocks/mockingpets → genera mascotas mock", async () => {

    const res = await request(app).get("/api/mocks/mockingpets");

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe("success");
    expect(Array.isArray(res.body.payload)).toBe(true);
    expect(res.body.payload.length).toBeGreaterThan(0);

  });

  test("GET /api/mocks/mockingpets → estructura válida", async () => {

    const res = await request(app).get("/api/mocks/mockingpets");

    const pet = res.body.payload[0];

    expect(pet).toHaveProperty("name");
    expect(pet).toHaveProperty("specie");
    expect(pet).toHaveProperty("birthDate");

  });

  test("GET /api/mocks/mockingusers → genera usuarios mock", async () => {

    const res = await request(app).get("/api/mocks/mockingusers");

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe("success");
    expect(Array.isArray(res.body.payload)).toBe(true);
    expect(res.body.payload.length).toBeGreaterThan(0);

  });

  test("POST /api/mocks/generateData → inserta mocks en la DB", async () => {

    const res = await request(app)
      .post("/api/mocks/generateData")
      .send({
        users: 3,
        pets: 3
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe("success");

    const users = await User.find();
    const pets = await Pet.find();

    expect(users.length).toBe(3);
    expect(pets.length).toBe(3);

  });

  test("POST /api/mocks/generateData → debe usar valores por defecto", async () => {

    const res = await request(app)
      .post("/api/mocks/generateData")
      .send({});

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe("success");

    const users = await User.find();
    const pets = await Pet.find();

    expect(users.length).toBe(0);
    expect(pets.length).toBe(0);

  });

  test("POST /api/mocks/generateData → debe manejar valores inválidos", async () => {

    const res = await request(app)
      .post("/api/mocks/generateData")
      .send({
        users: "abc",
        pets: null
      });

    expect(res.statusCode).toBe(200);

  });

});