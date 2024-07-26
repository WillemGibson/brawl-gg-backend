const express = require("express");
const router = express.Router();

// MONGOOSE MODELS
const { UserModel } = require("../models/UserModel");
const {
  UserPasswordRecoveryModel,
} = require("../models/UserPasswordRecoveryModel");

// PASSWORD COMPARISON FUNCTION
const { comparePassword } = require("../utils/verifyUserPassword");

// JWT AUTHORIZATION FUNCTIONS
const { createUserJWT } = require("../utils/JWT/userJWT");

// SEND EMAIL FUNCTION
const { sendEmail } = require("../utils/sendEmail");
const { Mongoose } = require("mongoose");

//-----------------------  ROUTES ------------------------  //

// USER LOGIN
router.post("/", async (request, response, next) => {
  try {
    console.log("body is:");
    console.log(request.body);
    // CHECK IF THE BODY REQUEST HAS THE REQUIRED DATA
    if (!request.body.password || !request.body.email) {
      return next(new Error("Missing login details in login request."));
    }

    // SEARCH FOR USER DOCUMENT BY EMAIL
    const foundUser = await UserModel.findOne({
      email: request.body.email,
    }).exec();

    // CHECK THE USERS HASHED PASSWORD
    const isPasswordCorrect = await comparePassword(
      request.body.password,
      foundUser.password
    );

    // CREATE A JWT FOR THE USER
    let newJwt = "";
    if (isPasswordCorrect) {
      newJwt = createJwt(foundUser._id);

      response.json({
        jwt: newJwt,
      });
    } else {
      return next(new Error("Incorrect password."));
    }
  } catch (error) {
    console.error("Error in password reset route:", error);
    next(error);
  }
});

// USER FORGET PASSWORD
router.post("/password-reset", async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return next(new Error("Missing email in request"));
    }

    const foundUser = await UserModel.findOne({ email }).exec();

    if (!foundUser) {
      return res.status(404).json({ message: "Email not found" });
    }

    // Generate a random recovery code
    const recoveryCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Create a new recovery request
    let recoveryId = await UserPasswordRecoveryModel.create({
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
      return next(
        new Error("Password recovery email failed. Please contact support.")
      );
    }

    res.status(200).json({
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
    console.log("body is:");
    console.log(request.body);

    // SEARCH FOR USER PASSWORD RECOVERY DOCUMENT BY EMAIL

    // CHECK THE USERS HASHED PASSWORD

    // CREATE A JWT FOR THE USER

    response.status(200).json({
      message: "User router operation",
      bodyData: request.body,
    });
  } catch (error) {
    console.error("Error in password reset route:", error);
    next(error);
  }
});

// SET A NEW PASSWORD FOR THE USER
router.post("/new-password", async (request, response, next) => {
  try {
    console.log("body is:");
    console.log(request.body);

    // SEARCH FOR USER PASSWORD RECOVERY DOCUMENT BY EMAIL

    // UPDATE THE PASSWORD FOR THE USER

    // CREATE A JWT FOR THE USER

    response.status(203).response({
      message: "User updated there password router operation",
      bodyData: request.body,
    });
  } catch (error) {
    console.error("Error in password reset route:", error);
    next(error);
  }
});

module.exports = router;
