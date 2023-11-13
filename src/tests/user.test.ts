import request from "supertest";
import { app, server } from "../index";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

let test_id: number;

describe("User CRUD API", () => {
  beforeAll(async () => {});

  afterAll(async () => {
    // Clean up database
    await prisma.user.deleteMany();
    await prisma.$disconnect();
    server.close();
  });

  test("Create User", async () => {
    const userData = {
      name: "Tuna",
      email: "tuna@gmail.com",
      password: "1234567",
    };

    const response = await request(app).post("/api/create-user").send(userData);
    expect(response.statusCode).toBe(201);
    test_id = response.body.id;
    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("name", "Tuna");
    expect(response.body).toHaveProperty("email", "tuna@gmail.com");
    expect(response.body).toHaveProperty("isAdmin", false);
  });

  test("Get User", async () => {
    const response = await request(app).get(`/api/user/${test_id}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("id", test_id);
  });

  test("Update User", async () => {
    const updatedData = {
      name: "Sadine",
      email: "sadine@example.com",
      isAdmin: true,
    };
    const response = await request(app)
      .put(`/api/update-user/${test_id}`)
      .send(updatedData);
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("name", "Sadine");
  });

  test("Delete User", async () => {
    const response = await request(app).delete(`/api/delete-user/${test_id}`);
    expect(response.statusCode).toBe(204);
  });
});
