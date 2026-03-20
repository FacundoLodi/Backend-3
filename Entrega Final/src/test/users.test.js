import request from "supertest";
import mongoose from "mongoose";

import app from "../app.js";
import User from "../models/User.js";

describe("Users Router - Tests funcionales", () => {

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URL);
  });

  beforeEach(async () => {
    await User.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  test("GET /api/users → debe devolver todos los usuarios", async () => {

    await User.create({
      first_name: "Facundo",
      last_name: "Lodi",
      email: "facundo@test.com",
      age: 24,
      password: "123456E"
    });

    const res = await request(app).get("/api/users");

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe("success");
    expect(Array.isArray(res.body.payload)).toBe(true);

    expect(res.body.payload[0]).not.toHaveProperty("password");
  });

  test("POST /api/users → debe crear un usuario correctamente", async () => {

    const newUser = {
      first_name: "Facundo",
      last_name: "Lodi",
      email: "facundo@test.com",
      age: 30,
      password: "abc123"
    };

    const res = await request(app)
      .post("/api/users")
      .send(newUser);

    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe("success");
    expect(res.body.payload._id).toBeDefined();
    expect(res.body.payload.email).toBe(newUser.email);

    expect(res.body.payload).not.toHaveProperty("password");

    const dbUser = await User.findOne({ email: newUser.email });
    expect(dbUser.password).not.toBe(newUser.password);
  });

  test("POST /api/users → debe fallar si faltan datos obligatorios", async () => {

    const res = await request(app)
      .post("/api/users")
      .send({
        first_name: "Facundo"
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe("error");
    expect(res.body.message).toBe("Faltan datos obligatorios");
  });

  test("POST /api/users → debe fallar si el email ya existe", async () => {

    const userData = {
      first_name: "Facundo",
      last_name: "Lodi",
      email: "facundo@test.com",
      password: "123456"
    };

    await User.create(userData);

    const res = await request(app)
      .post("/api/users")
      .send(userData);

    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe("error");
    expect(res.body.message).toBe("Email ya registrado");
  });

  test("GET /api/users/:id → debe devolver un usuario por id", async () => {

    const user = await User.create({
      first_name: "Facundo",
      last_name: "Lodi",
      email: "facundo@test.com",
      age: 40,
      password: "123456"
    });

    const res = await request(app)
      .get(`/api/users/${user._id}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe("success");
    expect(res.body.payload.email).toBe(user.email);

    expect(res.body.payload).not.toHaveProperty("password");
  });

  test("GET /api/users/:id → debe devolver error si el usuario no existe", async () => {

    const fakeId = new mongoose.Types.ObjectId();

    const res = await request(app)
      .get(`/api/users/${fakeId}`);

    expect(res.statusCode).toBe(404);
    expect(res.body.status).toBe("error");
    expect(res.body.message).toBe("Usuario no encontrado");
  });

  test("GET /api/users/:id → debe fallar con ObjectId inválido", async () => {

    const res = await request(app)
      .get("/api/users/123");

    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe("error");
  });

  test("DELETE /api/users/:id → debe eliminar un usuario", async () => {

    const user = await User.create({
      first_name: "Facundo",
      last_name: "Lodi",
      email: "facundo@test.com",
      age: 28,
      password: "123456"
    });

    const res = await request(app)
      .delete(`/api/users/${user._id}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe("success");
    expect(res.body.message).toBe("Usuario eliminado correctamente");
  });

  test("DELETE /api/users/:id → debe fallar si el usuario no existe", async () => {

    const fakeId = new mongoose.Types.ObjectId();

    const res = await request(app)
      .delete(`/api/users/${fakeId}`);

    expect(res.statusCode).toBe(404);
    expect(res.body.status).toBe("error");
    expect(res.body.message).toBe("Usuario no encontrado");
  });

  test("DELETE /api/users/:id → debe fallar con ObjectId inválido", async () => {

    const res = await request(app)
      .delete("/api/users/123");

    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe("error");
  });

});

describe("Root endpoint", () => {

  test("GET / → API funcionando", async () => {

    const res = await request(app).get("/");

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe("success");
    expect(res.body.message).toBe("Pet Adoption API running");

  });

});