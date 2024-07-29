const request = require("supertest");
const express = require("express");
const signupRoute = require("../controllers/SignupRouter");
const { UserModel } = require("../models/UserModel");

// MOCK THE USER DATABASE MODEL
jest.mock("../models/UserModel");

// IMPORT THE APP AND ROUTE
const app = express();
app.use(express.json());
~app.use("/signup", signupRoute);

// BEFORE EACH TEST WE WILL CLEAR THE MOCK
describe("Signup Routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // TEST TO CHECK THAT ERROR IS THROW FOR MISSING FIELDS
  test("should return 400 if required fields are missing", async () => {
    const response = await request(app).post("/signup").send({});
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: "Missing details in body request.",
    });
  });

  // TEST TO CHECK THAT USER CAN SUCCESSFULLY BE CREATED WITH CORRECT DATA
  test("should create a new user and return 201 status", async () => {
    UserModel.create.mockResolvedValue({
      username: "testUser",
      email: "test@example.com",
      password: "hashedPassword",
    });

    const response = await request(app).post("/signup").send({
      username: "testUser",
      email: "test@example.com",
      password: "password123",
    });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      message: "User created successfully",
      user: {
        username: "testUser",
        email: "test@example.com",
        password: "hashedPassword",
      },
    });
  });

  // TEST TO CHECK TO DUPLICATE EMAILS AND OR USERNAMES
  test("should handle duplicate email or username error", async () => {
    UserModel.create.mockRejectedValue({ code: 11000 });

    const response = await request(app).post("/signup").send({
      username: "duplicateUser",
      email: "duplicate@example.com",
      password: "password123",
    });

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      error: "Username or Email already exist. Please try again.",
    });
  });

  // TEST THAT THE ROUTE WILL THROW AN ERROR THAT ARISES
  test("should handle unexpected errors", async () => {
    UserModel.create.mockRejectedValue(new Error("Unexpected error"));

    const response = await request(app).post("/signup").send({
      username: "testUser",
      email: "test@example.com",
      password: "password123",
    });

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      error: "An error occurred while creating the user. Please try again.",
      details: "Unexpected error",
    });
  });
});
