const express = require("express");
const router = express.Router();

// EMAIL FUNCTION
const { sendEmail } = require("../utils/sendEmail");

// USER MODEL 
const { UserModel } = require("../models/UserModel");

router.post("/", async (request, response, next) => {
  try {
    const { username, email, password } = request.body;

    // VERIFY BODY DATA
    if (!username || !email || !password) {
      return response
        .status(400)
        .json({ error: "Missing details in body request." });
    }

    // CREATE A NEW USER MODEL
    const newUser = await UserModel.create({ username, email, password });

    // SEND WELCOME EMAIL
    sendEmail(email, "welcome", username=);

    // SEND RESPONSE TO CLIENT
    return response.status(201).json({
      message: "User created successfully",
      user: newUser,
    });
  } catch (error) {
    // HANDLE DATABASE ERRORS
    if (error.code === 11000) {
      return response.status(500).json({
        error: "Username or Email already exist. Please try again.",
      });
    }
    console.error("Error creating new user:", error);
    return response.status(500).json({
      error: "An error occurred while creating the user. Please try again.",
      details: error.message,
    });
  }
});

module.exports = router;
