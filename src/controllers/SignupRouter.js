const express = require("express");
const { check, validationResult } = require("express-validator");
const router = express.Router();

// EMAIL FUNCTION
const { sendEmail } = require("../utils/sendEmail");

// USER MODEL
const { UserModel } = require("../models/UserModel");

// VALIDATION RULES
const signupValidationRules = [
  check("username")
    .notEmpty()
    .withMessage("Username is required")
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 characters long"),
  check("email").isEmail().withMessage("Invalid email address"),
  check("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];

router.post("/", signupValidationRules, async (request, response, next) => {
  // CHECK THE VALIDATION RULES
  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    return response.status(400).json({ errors: errors.array() });
  }

  try {
    const { username, email, password } = request.body;

    // CREATE A NEW USER MODEL
    const newUser = await UserModel.create({ username, email, password });

    // SEND WELCOME EMAIL
    sendEmail(email, "welcome", "no-code", username);

    // SEND RESPONSE TO CLIENT
    return response.status(201).json({
      message: "User created successfully",
      username: newUser.username,
      email: newUser.email,
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
