process.env.JWT_SECRET = "test-secret-key";

jest.mock("../models/jobRequest");
jest.mock("../models/blacklistedToken");

const request = require("supertest");
const jwt = require("jsonwebtoken");
const JobRequest = require("../models/jobRequest");
const BlacklistedToken = require("../models/blacklistedToken");
const app = require("../app");

const JOB_ID = "507f1f77bcf86cd799439011";

function authHeader() {
  const token = jwt.sign(
    { userId: "test-user-id" },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
  return { Authorization: `Bearer ${token}` };
}

describe("GET /api/jobs", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    BlacklistedToken.findOne.mockResolvedValue(null);
  });

  it("returns 401 when no token is provided", async () => {
    const response = await request(app).get("/api/jobs");

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Not authorized, no token");
    expect(JobRequest.find).not.toHaveBeenCalled();
  });

  it("returns 200 and a list of jobs", async () => {
    const jobs = [
      {
        _id: JOB_ID,
        title: "Fix leaking tap",
        description: "Kitchen sink leak",
        status: "Open",
        category: "Plumbing",
      },
    ];

    JobRequest.find.mockReturnValue({
      sort: jest.fn().mockResolvedValue(jobs),
    });

    const response = await request(app).get("/api/jobs").set(authHeader());

    expect(response.status).toBe(200);
    expect(response.body).toEqual(jobs);
    expect(JobRequest.find).toHaveBeenCalledWith({});
    expect(JobRequest.find().sort).toHaveBeenCalledWith({ createdAt: -1 });
  });

  it("returns 200 when filtering by category query parameter", async () => {
    JobRequest.find.mockReturnValue({
      sort: jest.fn().mockResolvedValue([]),
    });

    const response = await request(app)
      .get("/api/jobs")
      .query({ category: "Plumbing" })
      .set(authHeader());

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
    expect(JobRequest.find).toHaveBeenCalledWith({ category: "Plumbing" });
  });
});

describe("POST /api/jobs", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    BlacklistedToken.findOne.mockResolvedValue(null);
  });

  it("returns 401 when no token is provided", async () => {
    const response = await request(app)
      .post("/api/jobs")
      .send({ title: "New job", description: "Job details" });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Not authorized, no token");
    expect(JobRequest.create).not.toHaveBeenCalled();
  });

  it("returns 400 when title and description are missing", async () => {
    const response = await request(app)
      .post("/api/jobs")
      .set(authHeader())
      .send({});

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Title and description are required");
    expect(JobRequest.create).not.toHaveBeenCalled();
  });

  it("returns 400 when title and description are blank", async () => {
    const response = await request(app)
      .post("/api/jobs")
      .set(authHeader())
      .send({ title: "   ", description: "   " });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Title and description are required");
    expect(JobRequest.create).not.toHaveBeenCalled();
  });

  it("returns 201 when job is created successfully", async () => {
    const createdJob = {
      _id: JOB_ID,
      title: "Need a plumber",
      description: "Fix bathroom leak",
      status: "Open",
      category: "Plumbing",
    };

    JobRequest.create.mockResolvedValue(createdJob);

    const response = await request(app)
      .post("/api/jobs")
      .set(authHeader())
      .send({
        title: "Need a plumber",
        description: "Fix bathroom leak",
        category: "Plumbing",
      });

    expect(response.status).toBe(201);
    expect(response.body).toEqual(createdJob);
    expect(JobRequest.create).toHaveBeenCalledWith({
      title: "Need a plumber",
      description: "Fix bathroom leak",
      category: "Plumbing",
    });
  });
});
