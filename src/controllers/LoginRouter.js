const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");

// MONGOOSE MODELS
const { UserModel } = require("../models/UserModel");
const {
  UserPasswordRecoveryModel,
} = require("../models/UserPasswordRecoveryModel");

// PASSWORD COMPARISON FUNCTION
const { comparePasswords } = require("../utils/verifyUserPassword");

// JWT AUTHORIZATION FUNCTIONS
const { createUserJWT } = require("../utils/JWT/userJWT");

// SEND EMAIL FUNCTION
const { sendEmail } = require("../utils/sendEmail");

//-----------------------  ROUTES ------------------------//

// USER LOGIN
const loginValidationRules = [
  check("email").isEmail().withMessage("Invalid email address"),
  check("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];

router.post("/", loginValidationRules, async (request, response, next) => {
  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    return response.status(400).json({ errors: errors.array() });
  }

  try {
    const { email, password } = request.body;
    console.log(email, password);
    // SEARCH FOR USER DOCUMENT BY EMAIL
    const foundUser = await UserModel.findOne({ email }).exec();
    console.log(foundUser);
    if (!foundUser) {
      return response
        .status(401)
        .json({ error: "Invalid credentials. Couldn't Find User" });
    }

    // CHECK THE USER'S HASHED PASSWORD
    const isPasswordCorrect = await comparePasswords(
      password,
      foundUser.password
    );

    console.log(isPasswordCorrect);
    if (!isPasswordCorrect) {
      return response
        .status(401)
        .json({ error: "Invalid credentials. Wrong Password" });
    }

    // CREATE A JWT FOR THE USER
    const newJwt = createUserJWT({
      userId: foundUser._id,
      username: foundUser.username,
      isAdmin: foundUser.isAdmin,
    });
    return response.status(200).json({
      username: foundUser.username,
      email: foundUser.email,
      jwt: newJwt,
    });
  } catch (error) {
    console.error("Error in user login route:", error);
    return response
      .status(500)
      .json({ error: "Internal server error. Please try again." });
  }
});

// USER FORGET PASSWORD
const passwordResetValidationRules = [
  check("email").isEmail().withMessage("Invalid email address"),
];

router.post(
  "/forgot-password",
  passwordResetValidationRules,
  async (request, response, next) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(400).json({ errors: errors.array() });
    }

    try {
      const { email } = request.body;

      const foundUser = await UserModel.findOne({ email }).exec();
      if (!foundUser) {
        return response.status(404).json({ error: "User not found." });
      }

      // Generate a random recovery code
      const recoveryCode = Math.floor(
        100000 + Math.random() * 900000
      ).toString();

      // Create a new recovery request
      const recoveryId = await UserPasswordRecoveryModel.create({
        userId: foundUser._id,
        passcode: recoveryCode,
      });

      // Send the recovery email
      const mailResponse = await sendEmail(
        foundUser.email,
        "password-reset",
        recoveryCode,
        foundUser.username
      );
      if (!mailResponse) {
        return response.status(500).json({
          error: "Password recovery email failed. Please contact support.",
        });
      }

      response.status(200).json({
        message: "Password recovery passcode sent",
        mailResponse,
        recoveryId: recoveryId._id,
      });
    } catch (error) {
      console.error("Error in password reset route:", error);
      next(error);
    }
  }
);

// CHECK THE RECOVERY CODE
const checkRecoveryCodeValidationRules = [
  check("recoveryId")
    .notEmpty()
    .withMessage("Recovery ID is required")
    .isString()
    .withMessage("Recovery ID must be a string"),
  check("passcode")
    .notEmpty()
    .withMessage("Passcode is required")
    .isLength({ min: 6, max: 6 })
    .withMessage("Passcode must be 6 characters long"),
];

router.post(
  "/check-recovery-code",
  checkRecoveryCodeValidationRules,
  async (request, response, next) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(400).json({ errors: errors.array() });
    }

    try {
      const { recoveryId, passcode } = request.body;

      // SEARCH FOR USER PASSWORD RECOVERY DOCUMENT BY ID
      const foundUserPasscode = await UserPasswordRecoveryModel.findById(
        recoveryId
      ).exec();
      if (!foundUserPasscode) {
        return response
          .status(404)
          .json({ error: "Recovery ID not found or expired." });
      }

      // CHECK THE USERS PASSCODE MATCHES
      if (passcode !== foundUserPasscode.passcode) {
        return response.status(401).json({ error: "Incorrect passcode." });
      }

      response.status(200).json({
        message: "Passcode correct",
        bodyData: request.body,
      });
    } catch (error) {
      console.error("Error in check recovery code route:", error);
      next(error);
    }
  }
);

// SET A NEW PASSWORD FOR THE USER
const newPasswordValidationRules = [
  check("email").isEmail().withMessage("Invalid email address"),
  check("recoveryId")
    .notEmpty()
    .withMessage("Recovery ID is required")
    .isString()
    .withMessage("Recovery ID must be a string"),
  check("passcode")
    .notEmpty()
    .withMessage("Passcode is required")
    .isLength({ min: 6, max: 6 })
    .withMessage("Passcode must be 6 characters long"),
  check("newPassword")
    .notEmpty()
    .withMessage("New password is required")
    .isLength({ min: 6 })
    .withMessage("New password must be at least 6 characters long"),
];

router.post(
  "/new-password",
  newPasswordValidationRules,
  async (request, response, next) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(400).json({ errors: errors.array() });
    }

    try {
      console.log("body is:");
      console.log(request.body);

      const { email, recoveryId, passcode, newPassword } = request.body;

      // SEARCH FOR USER PASSWORD RECOVERY DOCUMENT BY ID
      const foundUserPasscode = await UserPasswordRecoveryModel.findById(
        recoveryId
      ).exec();
      if (!foundUserPasscode) {
        return response
          .status(404)
          .json({ error: "Recovery ID not found or expired." });
      }

      // CHECK THE USERS PASSCODE MATCHES
      if (passcode !== foundUserPasscode.passcode) {
        return response.status(401).json({ error: "Incorrect passcode." });
      }

      // UPDATE THE PASSWORD FOR THE USER
      const updateUserPassword = await UserModel.updateOne(
        { email },
        { password: newPassword }
      ).exec();

      if (!updateUserPassword) {
        return response
          .status(500)
          .json({ error: "Password update failed. Please contact support." });
      }

      response.status(200).json({
        message: "Password updated successfully.",
      });
    } catch (error) {
      console.error("Error in new password route:", error);
      next(error);
    }
  }
);

module.exports = router;
