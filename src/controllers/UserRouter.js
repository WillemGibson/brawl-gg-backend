const express = require("express");
const router = express.Router();

const { check, validationResult } = require("express-validator");

// MONGOOSE MODELS
const { UserModel } = require("../models/UserModel");
const { TournamentModel } = require("../models/TournamentModel");

// JWT AUTHORIZATION FUNCTIONS
const { userValidateJWTAndRefreshIt } = require("../utils/JWT/userJWT");

//-----------------------  ROUTES ------------------------  //

// GET USER DASHBOARD DATA
router.get(
  "/dashboard",
  userValidateJWTAndRefreshIt,
  async (request, response) => {
    try {
      // ACCESS USER DETAILS FROM JWT
      const JWT = request.freshJWT;
      const userId = request.user.id;
      const isAdmin = request.user.isAdmin;

      // SEARCH FOR USER DOCUMENT BY userId
      const foundUser = await UserModel.findOne({ _id: userId }).exec();
      console.log(foundUser);

      // HANDLE CASE WHERE USER IS NOT FOUND
      if (!foundUser) {
        return response.status(401).json({
          error: "Invalid credentials. Couldn't find user",
        });
      }

      // EXTRACT NECESSARY FIELDS ONLY
      let userResponseData = {
        id: userId,
        username: foundUser.username,
        email: foundUser.email,
        yourTournaments: foundUser.tournaments,
        profileImg: foundUser.profileImage,
      };

      // IF USER IS AN ADMIN, INCLUDE ADDITIONAL DATA
      if (isAdmin) {
        const totalUsers = await UserModel.countDocuments().exec();
        const totalTournaments = await TournamentModel.countDocuments().exec();

        // AGGREGATE THE TOTAL NUMBER OF USERS IN ALL TOURNAMENTS
        const tournamentsData = await TournamentModel.aggregate([
          {
            $group: {
              _id: null,
              totalUsersInTournaments: { $sum: { $size: "$users" } },
            },
          },
        ]).exec();

        // RETURN 0 IF THE THERE ARE NO USERS IN TOURNAMENTS
        const totalUsersInTournaments =
          tournamentsData[0]?.totalUsersInTournaments || 0;

        userResponseData = {
          ...userResponseData,
          totalUsers,
          totalTournaments,
          totalUsersInTournaments,
        };
      }

      // RESPOND WITH USER INFORMATION AND JWT
      response.json({
        message: "User data fetched successfully",
        jwt: JWT,
        userData: userResponseData,
      });
    } catch (error) {
      console.log(error);
      response.status(500).json({ message: "Server error" });
    }
  }
);

// GET ALL USERS (ADMIN ONLY)
router.get(
  "/all",
  userValidateJWTAndRefreshIt,
  async (request, response, next) => {
    try {
      // ACCESS THE NEW JWT AND IS ADMIN BOOLEAN
      const JWT = request.freshJWT;
      const isAdmin = request.user.isAdmin;

      // IF USER IS NOT AN ADMIN, RETURN INVALID PERMISSIONS
      if (!isAdmin) {
        return response.status(401).json({
          error: "Invalid Permissions,  ADMIN ROUTE!",
        });
      }

      // IF THE USER IS AN ADMIN, RETRIEVE ALL USERS
      const allUsers = await UserModel.find().exec(); // Corrected method from `findAll` to `find`
      response.json({
        message: "User Router Get all users",
        users: allUsers,
        jwt: JWT,
      });
    } catch (error) {
      console.log(error);
      response.status(500).json({ message: "Server error" });
    }
  }
);

// GET USER BY EMAIL
router.get(
  "/:email",
  userValidateJWTAndRefreshIt,
  async (request, response, next) => {
    // IF USER IS NOT AN ADMIN, RETURN INVALID PERMISSIONS
    if (!isAdmin) {
      return response.status(401).json({
        error: "Invalid Permissions, ADMIN ROUTE!",
      });
    }
    const email = request.params.email;

    try {
      // SEARCH FOR USER DOCUMENT BY EMAIL
      const user = await UserModel.findOne({ email }).exec();

      // HANDLE CASE WHERE USER IS NOT FOUND
      if (!user) {
        return response.status(404).json({
          message: "User not found",
        });
      }

      // RESPOND WITH USER INFORMATION
      response.json({
        message: "User found",
        user,
      });
    } catch (error) {
      console.error(error);
      next(error); // Forward the error to the error-handling middleware
    }
  }
);

// VALIDATION RULES FOR USER UPDATE
const updateValidationRules = [
  check("username")
    .optional()
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 characters long"),
  check("email").optional().isEmail().withMessage("Invalid email address"),
  check("password")
    .optional()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  check("profileImage")
    .optional()
    .isString()
    .withMessage("Profile image must be a string"),
];

// UPDATE A USER
router.patch(
  "/",
  updateValidationRules,
  userValidateJWTAndRefreshIt,
  async (request, response, next) => {
    // VALIDATE REQUEST BODY
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(400).json({ errors: errors.array() });
    }

    // ACCESS USER DETAILS AND UPDATE DATA
    const userId = request.user.id;
    const updateData = request.body;
    const JWT = request.user.jwt;

    try {
      // SEARCH FOR USER DOCUMENT BY userId
      const foundUser = await UserModel.findOne({ _id: userId }).exec();
      if (!foundUser) {
        return response
          .status(401)
          .json({ error: "Invalid credentials. Couldn't find user." });
      }

      // UPDATE THE USER WITH NEW DATA
      Object.assign(foundUser, updateData);

      // SAVE THE UPDATED USER DOCUMENT
      await foundUser.save();

      // RESPOND WITH UPDATED USER JWT
      response.json({
        message: "User updated successfully",
        jwt: JWT,
      });
    } catch (error) {
      console.error(error);
      next(error); // Forward the error to the error-handling middleware
    }
  }
);

// DELETE A USER
router.delete(
  "/",
  userValidateJWTAndRefreshIt,
  async (request, response, next) => {
    // ACCESS USER ID
    const userId = request.user.id;

    try {
      // SEARCH FOR USER DOCUMENT BY userId
      const foundUser = await UserModel.findOne({ _id: userId }).exec();
      if (!foundUser) {
        return response
          .status(401)
          .json({ error: "Invalid credentials. Couldn't find user." });
      }

      // DELETE USER
      await UserModel.deleteOne({ _id: userId }).exec();

      // RESPOND WITH SUCCESS MESSAGE
      response.json({
        message: "User deleted successfully",
      });
    } catch (error) {
      console.error(error);
      response.status(500).json({ message: "Server error" });
    }
  }
);

module.exports = router;
