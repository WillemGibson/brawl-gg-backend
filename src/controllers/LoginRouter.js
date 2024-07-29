const express = require("express");
const router = express.Router();

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
router.post("/", async (request, response, next) => {
  try {
    const { email, password } = request.body;

    // CHECK IF THE BODY REQUEST HAS THE REQUIRED DATA
    if (!email || !password) {
      return response
        .status(400)
        .json({ error: "Email and password are required." });
    }

    // SEARCH FOR USER DOCUMENT BY EMAIL
    const foundUser = await UserModel.findOne({ email }).exec();
    if (!foundUser) {
      return response.status(401).json({ error: "Invalid credentials." });
    }

    // CHECK THE USER'S HASHED PASSWORD
    const isPasswordCorrect = await comparePasswords(
      password,
      foundUser.password
    );
    if (!isPasswordCorrect) {
      return response.status(401).json({ error: "Invalid credentials." });
    }

    // CREATE A JWT FOR THE USER
    const newJwt = createUserJWT({ userId: foundUser._id });
    return response
      .status(200)
      .json({ username: foundUser.username, jwt: newJwt });
  } catch (error) {
    console.error("Error in user login route:", error);
    return response
      .status(500)
      .json({ error: "Internal server error. Please try again." });
    next(error);
  }
});

// USER FORGET PASSWORD
router.post("/password-reset", async (request, response, next) => {
  try {
    const { email } = request.body;

    if (!email) {
      return response
        .status(400)
        .json({ error: "Missing details in body request." });
    }

    const foundUser = await UserModel.findOne({ email }).exec();
    if (!foundUser) {
      return response.status(404).json({ error: "User not found." });
    }

    // Generate a random recovery code
    const recoveryCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Create a new recovery request
    const recoveryId = await UserPasswordRecoveryModel.create({
      userId: foundUser._id,
      passcode: recoveryCode,
    });

    // Send the recovery email
    const mailResponse = await sendEmail(
      foundUser.email,
      "password-reset",
      recoveryCode
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
});

// CHECK THE RECOVERY CODE
router.post("/check-recovery-code", async (request, response, next) => {
  try {
    const { recoveryId, passcode } = request.body;

    if (!recoveryId || !passcode) {
      return response
        .status(400)
        .json({ error: "Missing details in body request." });
    }

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
});

// SET A NEW PASSWORD FOR THE USER
router.post("/new-password", async (request, response, next) => {
  try {
    console.log("body is:");
    console.log(request.body);

    const { email, recoveryId, passcode, newPassword } = request.body;

    if (!email || !recoveryId || !passcode || !newPassword) {
      return response
        .status(400)
        .json({ error: "Missing details in body request." });
    }

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
});

module.exports = router;
