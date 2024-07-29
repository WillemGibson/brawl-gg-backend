const express = require("express");
const router = express.Router();

// JWT AUTHORIZATION FUNCTIONS
const { userValidateJWTAndRefreshIt } = require("../utils/JWT/userJWT");
const {
  createJoinGameJWT,
  validateJoinGameJWT,
} = require("../utils/JWT/joinGameJWT");

// GET ALL TOURNAMENT
router.get("/all", async (request, response, next) => {
  response.json({
    message: "Tournament Router Get all Tournaments",
  });
});

// GET ALL TOURNAMENT BY AUTHOR
router.get("/all/:id", async (request, response, next) => {
  response.json({
    message: "Tournament Router all Tournaments for one user",
  });
});

// GET ONE TOURNAMENT
router.get("/:id", async (request, response, next) => {
  response.json({
    message: "Tournament Router get one Tournament",
  });
});

// JOIN A TOURNAMENT
router.get(
  "/join/:token",
  validateJoinGameJWT,
  userValidateJWTAndRefreshIt,
  async (request, response) => {
    // PASS THE USER DECODED JWT
    const userData = request.decodedJWT;
    // ADD THE USER TO THE TOURNAMENT

    // REDIRECT THE USER TO THE TOURNAMENT
    const tournamentId = request.params.tournamentId;
    response.redirect(`http://brawls.io/tournament/${tournamentId}`);
  }
);

// CREATE A TOURNAMENT
router.post("/", async (request, response, next) => {
  response.json({
    message: "Tournament Router create a new Tournament",
  });
});

// UPDATE A TOURNAMENT
router.patch("/:id", async (request, response, next) => {
  response.json({
    message: "Tournament Router update a Tournament",
  });
});

// DELETE A TOURNAMENT
router.delete("/:id", async (request, response, next) => {
  response.json({
    message: "Tournament Delete Route",
  });
});

module.exports = router;
