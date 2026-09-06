import bcrypt from "bcryptjs";
import request from "supertest";

jest.mock("../src/config/prisma", () => ({
  prisma: {
    user: {
      findFirst: jest.fn(),
      update: jest.fn(),
    },
  },
}));

import { prisma } from "../src/config/prisma";
import { createApp } from "../src/app";

const app = createApp();
const findFirst = prisma.user.findFirst as jest.Mock;
const update = prisma.user.update as jest.Mock;

const SEEDED_USER = {
  id: 1,
  name: "System Administrator",
  email: "admin@besttech.com",
  phone: null,
  avatarUrl: null,
  status: "active",
  lastLoginAt: null,
  createdAt: new Date(),
  roleId: 1,
  role: { id: 1, name: "super_admin", displayName: "Super Admin" },
};

describe("POST /api/auth/login", () => {
  beforeEach(() => {
    findFirst.mockReset();
    update.mockReset();
  });

  it("logs in with valid credentials and sets a cookie", async () => {
    const passwordHash = await bcrypt.hash("Admin@123", 10);
    findFirst.mockResolvedValue({ ...SEEDED_USER, password: passwordHash });
    update.mockResolvedValue(SEEDED_USER);

    const res = await request(app).post("/api/auth/login").send({
      email: "admin@besttech.com",
      password: "Admin@123",
    });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.email).toBe("admin@besttech.com");
    expect(res.headers["set-cookie"]?.[0]).toMatch(/besttech_token=/);
  });

  it("rejects an invalid password with a clear message", async () => {
    const passwordHash = await bcrypt.hash("Admin@123", 10);
    findFirst.mockResolvedValue({ ...SEEDED_USER, password: passwordHash });

    const res = await request(app).post("/api/auth/login").send({
      email: "admin@besttech.com",
      password: "wrong-password",
    });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/invalid email or password/i);
  });

  it("rejects an unknown email", async () => {
    findFirst.mockResolvedValue(null);

    const res = await request(app).post("/api/auth/login").send({
      email: "nobody@besttech.com",
      password: "whatever123",
    });

    expect(res.status).toBe(401);
  });
});

describe("GET /api/auth/me", () => {
  it("rejects a request without a token", async () => {
    const res = await request(app).get("/api/auth/me");
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });
});

describe("Protected routes", () => {
  it("reject requests without a token with 401", async () => {
    const res = await request(app).get("/api/users");
    expect(res.status).toBe(401);
  });
});
