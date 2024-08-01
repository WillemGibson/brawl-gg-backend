const express = require("express");
const router = express.Router();

const { check, validationResult } = require("express-validator");

// MONGOOSE MODELS
const { UserModel } = require("../models/UserModel");
const { TournamentModel } = require("../models/TournamentModel");

// JWT AUTHORIZATION FUNCTIONS
const { userValidateJWTAndRefreshIt } = require("../utils/JWT/userJWT");

//-----------------------  ROUTES ------------------------  //

router.get(
  "/dashboard",
  userValidateJWTAndRefreshIt,
  async (request, response) => {
    try {
      // Access user details
      const JWT = request.freshJWT;
      const userId = request.user.id;
      const isAdmin = request.user.isAdmin;
      console.log(userId);

      // Search for user document by userId
      const foundUser = await UserModel.findOne({ _id: userId }).exec();
      if (!foundUser) {
        return response
          .status(401)
          .json({ error: "Invalid credentials. Couldn't find user." });
      }

      // Extract necessary fields only
      let userResponseData = {
        username: foundUser.username,
        email: foundUser.email,
        yourTournaments: foundUser.tournaments,
        profileImg: foundUser.profileImage,
      };

      // If the user is an admin, include additional data
      if (!isAdmin) {
        const totalUsers = await UserModel.countDocuments().exec();
        const totalTournaments = await TournamentModel.countDocuments().exec();

        // Aggregate the total number of users in all tournaments
        const tournamentsData = await TournamentModel.aggregate([
          {
            $group: {
              _id: null,
              totalUsersInTournaments: { $sum: { $size: "$users" } },
            },
          },
        ]).exec();

        const totalUsersInTournaments =
          tournamentsData[0]?.totalUsersInTournaments || 0;

        userResponseData = {
          ...userResponseData,
          totalUsers,
          totalTournaments,
          totalUsersInTournaments,
        };
      }

      // Respond with user information and JWT
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
