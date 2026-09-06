import request from "supertest";

jest.mock("../src/config/prisma", () => ({
  prisma: {
    user: {
      findFirst: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    role: {
      findUnique: jest.fn(),
    },
  },
}));

import { prisma } from "../src/config/prisma";
import { createApp } from "../src/app";
import { makeAuthCookie, FAKE_ADMIN, FAKE_STAFF, FAKE_SUPER_ADMIN } from "./helpers/authToken";

const app = createApp();

const mocks = {
  findFirst: prisma.user.findFirst as jest.Mock,
  findMany: prisma.user.findMany as jest.Mock,
  count: prisma.user.count as jest.Mock,
  create: prisma.user.create as jest.Mock,
  update: prisma.user.update as jest.Mock,
  roleFindUnique: prisma.role.findUnique as jest.Mock,
};

beforeEach(() => {
  Object.values(mocks).forEach((fn) => fn.mockReset());
});

describe("POST /api/users", () => {
  it("rejects unauthenticated requests", async () => {
    const res = await request(app).post("/api/users").send({ name: "New User" });
    expect(res.status).toBe(401);
  });

  it("rejects staff users with 403 (not a user manager role)", async () => {
    const res = await request(app)
      .post("/api/users")
      .set("Cookie", makeAuthCookie(FAKE_STAFF))
      .send({ name: "New User", email: "new@besttech.com", password: "Password@123", roleId: 3 });

    expect(res.status).toBe(403);
  });

  it("returns 422 with field errors when required fields are missing", async () => {
    const res = await request(app)
      .post("/api/users")
      .set("Cookie", makeAuthCookie(FAKE_ADMIN))
      .send({ email: "not-an-email" });

    expect(res.status).toBe(422);
    expect(res.body.success).toBe(false);
    expect(res.body.errors).toBeDefined();
    expect(res.body.errors.name).toBeDefined();
    expect(res.body.errors.password).toBeDefined();
  });

  it("creates a user when payload is valid and role manages users", async () => {
    mocks.roleFindUnique.mockResolvedValue({ id: 3, name: "staff" });
    mocks.findFirst.mockResolvedValue(null); // email available
    mocks.create.mockResolvedValue({
      id: 10,
      name: "New User",
      email: "new@besttech.com",
      phone: null,
      avatarUrl: null,
      status: "active",
      lastLoginAt: null,
      createdAt: new Date(),
      role: { id: 3, name: "staff", displayName: "Staff" },
    });

    const res = await request(app)
      .post("/api/users")
      .set("Cookie", makeAuthCookie(FAKE_ADMIN))
      .send({ name: "New User", email: "new@besttech.com", password: "Password@123", roleId: 3 });

    expect(res.status).toBe(201);
    expect(res.body.data.email).toBe("new@besttech.com");
  });
});

describe("DELETE /api/users/:id", () => {
  it("rejects unauthenticated requests", async () => {
    const res = await request(app).delete("/api/users/5");
    expect(res.status).toBe(401);
  });

  it("soft-deletes a user as super admin", async () => {
    mocks.findFirst.mockResolvedValue({
      id: 5,
      email: "someone@besttech.com",
      role: { id: 3, name: "staff" },
    });
    mocks.update.mockResolvedValue({});

    const res = await request(app).delete("/api/users/5").set("Cookie", makeAuthCookie(FAKE_SUPER_ADMIN));

    expect(res.status).toBe(204);
    expect(mocks.update).toHaveBeenCalledWith({
      where: { id: 5 },
      data: { deletedAt: expect.any(Date) },
    });
  });

  it("blocks an admin from deleting a super admin account", async () => {
    mocks.findFirst.mockResolvedValue({
      id: 1,
      email: "root@besttech.com",
      role: { id: 1, name: "super_admin" },
    });

    const res = await request(app).delete("/api/users/1").set("Cookie", makeAuthCookie(FAKE_ADMIN));

    expect(res.status).toBe(403);
  });
});
