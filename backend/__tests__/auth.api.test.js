process.env.JWT_SECRET = "test-secret-key";

jest.mock("../models/user");
jest.mock("bcryptjs", () => ({
  hash: jest.fn().mockResolvedValue("hashed-password"),
  compare: jest.fn(),
}));

const request = require("supertest");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const app = require("../app");

describe("POST /api/auth/register", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns 400 when email and password are missing", async () => {
    const response = await request(app).post("/api/auth/register").send({});

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Email and password are required");
  });

  it("returns 400 when user already exists", async () => {
    User.findOne.mockResolvedValue({ email: "test@example.com" });

    const response = await request(app)
      .post("/api/auth/register")
      .send({ email: "test@example.com", password: "password123" });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("User already exists");
    expect(User.create).not.toHaveBeenCalled();
  });

  it("returns 201 when registration succeeds", async () => {
    User.findOne.mockResolvedValue(null);
    User.create.mockResolvedValue({
      _id: "user123",
      email: "new@example.com",
    });

    const response = await request(app)
      .post("/api/auth/register")
      .send({ email: "new@example.com", password: "password123" });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("User registered successfully");
    expect(response.body.user).toEqual({
      _id: "user123",
      email: "new@example.com",
    });
    expect(bcrypt.hash).toHaveBeenCalledWith("password123", 10);
    expect(User.create).toHaveBeenCalledWith({
      email: "new@example.com",
      password: "hashed-password",
    });
  });
});

describe("POST /api/auth/login", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns 400 when email and password are missing", async () => {
    const response = await request(app).post("/api/auth/login").send({});

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Email and password are required");
  });

  it("returns 401 when user is not found", async () => {
    User.findOne.mockResolvedValue(null);

    const response = await request(app)
      .post("/api/auth/login")
      .send({ email: "missing@example.com", password: "password123" });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Invalid email or password");
  });

  it("returns 401 when password is incorrect", async () => {
    User.findOne.mockResolvedValue({
      _id: "user123",
      email: "test@example.com",
      password: "hashed-password",
    });
    bcrypt.compare.mockResolvedValue(false);

    const response = await request(app)
      .post("/api/auth/login")
      .send({ email: "test@example.com", password: "wrong-password" });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Invalid email or password");
  });

  it("returns 200 and a token when credentials are valid", async () => {
    User.findOne.mockResolvedValue({
      _id: "user123",
      email: "test@example.com",
      password: "hashed-password",
    });
    bcrypt.compare.mockResolvedValue(true);

    const response = await request(app)
      .post("/api/auth/login")
      .send({ email: "test@example.com", password: "password123" });

    expect(response.status).toBe(200);
    expect(typeof response.body.token).toBe("string");
    expect(response.body.token.length).toBeGreaterThan(0);
    expect(response.body.user).toEqual({
      _id: "user123",
      email: "test@example.com",
    });
    expect(bcrypt.compare).toHaveBeenCalledWith(
      "password123",
      "hashed-password"
    );
  });
});
