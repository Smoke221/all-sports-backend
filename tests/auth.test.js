const request = require("supertest");
const app = require("../index");
require("../setup");

describe("POST /auth/register", () => {
  test("should register a new user", async () => {
    const res = await request(app).post("/auth/register").send({
      name: "John Doe",
      email: "johndoe@example.com",
      pass: "password123",
    });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("message", "User registered successfully");
  });

  test("should not register an existing user", async () => {
    // Register the user first
    await request(app).post("/auth/register").send({
      name: "Test User",
      email: "test@example.com",
      pass: "password123",
    });

    // Try to register again with the same email
    const res = await request(app).post("/auth/register").send({
      name: "Test User",
      email: "test@example.com",
      pass: "password123",
    });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty("error", "Email already registered");
  });
});

describe("POST /auth/login", () => {
  test("should login an existing user", async () => {
    // Register the user first
    await request(app).post("/auth/register").send({
      name: "Test User",
      email: "test@example.com",
      pass: "password123",
    });

    const res = await request(app).post("/auth/login").send({
      email: "test@example.com",
      pass: "password123",
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("message", "Login Success.");
    expect(res.body).toHaveProperty("token");
  });

  test("should not login with wrong credentials", async () => {
    // Register the user first
    await request(app).post("/auth/register").send({
      name: "Test User",
      email: "test@example.com",
      pass: "password123",
    });
    const res = await request(app).post("/auth/login").send({
      email: "test@example.com",
      pass: "wrongPassword",
    });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty("error", "Invalid credentials");
  });
});
