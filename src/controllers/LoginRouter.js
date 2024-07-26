const express = require("express");
const router = express.Router();

// PASSWORD COMPARISON FUNCTION
const { comparePassword } = require("../utils/verifyUserPassword");

// JWT AUTHORIZATION FUNCTIONS
const { createUserJWT } = require("../utils/JWT/userJWT");

// SEND EMAIL FUNCTION
const { sendEmail } = require("../utils/sendEmail");

//-----------------------  ROUTES ------------------------  //

// USER LOGIN
router.post("/", async (request, response, next) => {
  try {
    console.log("body is:");
    console.log(request.body);

    // SEARCH FOR USER DOCUMENT BY EMAIL

    // CHECK THE USERS HASHED PASSWORD

    // CREATE A JWT FOR THE USER

    response.json({
      message: "User router operation",
      bodyData: request.body,
    });
  } catch (error) {
    console.error("Error in password reset route:", error);
    next(error);
  }
});

// USER FORGET PASSWORD
router.post("/password-reset", async (request, response, next) => {
  try {
    console.log("body is:");
    console.log(request.body);
    const userEmail = request.body.email;

    // SEARCH DATABASE FOR USER

    // CREATE A RANDOM RECOVERY CODE
    let recoveryCode = Math.floor(100000 + Math.random() * 900000);

    // CREATE A NEW USER PASSWORD RECOVERY DB MODEL

    // Send the recovery email
    const mailResponse = await sendEmail(
      userEmail,
      "password-reset",
      recoveryCode
    );

    // CHECK IF THE EMAIL WAS SENT SUCCESSFULLY
    if (!mailResponse) {
      return next(
        new Error("Password recovery failed. Please contact brawl.gg support.")
      );
    }

    response.status(200).json({
      message: "Password reset email Route",
      userEmail,
      mailResponse,
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
