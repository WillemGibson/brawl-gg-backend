const express = require("express");
const router = express.Router();

// MONGOOSE MODELS
const { UserModel } = require("../models/UserModel");

// JWT AUTHORIZATION FUNCTIONS
const { userValidateJWTAndRefreshIt } = require("../utils/JWT/userJWT");

//-----------------------  ROUTES ------------------------  //

// GET ALL USERS
router.get("/all", async (request, response, next) => {
  try {
    const allUsers = await UserModel.findAll().exec();
    response.json({
      message: "User Router Get all users",
      users: allUsers,
    });
  } catch (error) {
    console.log(error);
  }
});

// GET ONE USER
router.get("/:email", async (request, response, next) => {
  response.json({
    message: "User Router get one user",
  });
});

// CREATE A USER
router.post("/", async (request, response, next) => {
  response.json({
    message: "User Router create a new user",
  });
});

// UPDATE A USER
router.patch("/", async (request, response, next) => {
  response.json({
    message: "User Router update a user",
  });
});

// DELETE A USER
router.delete("/", async (request, response, next) => {
  response.json({
    message: "user Delete Route",
  });
});

module.exports = router;
