const express = require("express");
const router = express.Router();

// EXPRESS VALIDATOR
const { check, validationResult } = require("express-validator");

// JWT AUTHORIZATION FUNCTIONS
const { userValidateJWTAndRefreshIt } = require("../utils/JWT/userJWT");
const {
  createJoinGameJWT,
  validateJoinGameJWT,
} = require("../utils/JWT/joinGameJWT");

// TOURNAMENT MODEL
const { TournamentModel } = require("../models/TournamentModel");
const { UserModel } = require("../models/UserModel");

//-----------------------------ROUTES-------------------------------//

// GET ALL TOURNAMENTS
router.get("/all", async (request, response, next) => {
  try {
    // FETCH ALL TOURNAMENTS FROM THE DATABASE
    const tournaments = await TournamentModel.find();
    response.json({
      message: "Tournament Router Get all Tournaments",
      tournaments,
    });
  } catch (error) {
    // HANDLE ANY ERRORS THAT OCCUR
    console.error("Error fetching tournaments:", error);
    next(error);
  }
});

// GET ALL TOURNAMENTS BY AUTHOR
router.get("/all/:id", async (request, response, next) => {
  try {
    // FETCH TOURNAMENTS CREATED BY A SPECIFIC AUTHOR (AUTHOR ID PROVIDED IN URL PARAMS)
    const authorId = request.params.id;
    const tournaments = await TournamentModel.find({ authorId });
    response.json({
      message: "Tournament Router all Tournaments for one user",
      tournaments,
    });
  } catch (error) {
    // HANDLE ANY ERRORS THAT OCCUR
    console.error("Error fetching tournaments by author:", error);
    next(error);
  }
});

// GET ONE TOURNAMENT
router.get("/:id", async (request, response, next) => {
  try {
    // FETCH A SPECIFIC TOURNAMENT BY ITS ID (PROVIDED IN URL PARAMS)
    const tournamentId = request.params.id;
    const tournament = await TournamentModel.findById(tournamentId);

    if (!tournament) {
      return response.status(404).json({ message: "Tournament not found" });
    }

    response.json({
      message: "Tournament Router get one Tournament",
      tournament,
    });
  } catch (error) {
    // HANDLE ANY ERRORS THAT OCCUR
    console.error("Error fetching tournament:", error);
    next(error);
  }
});

// JOIN A TOURNAMENT
router.get(
  "/join/:token",
  validateJoinGameJWT,
  userValidateJWTAndRefreshIt,
  async (request, response, next) => {
    try {
      // PASS THE USER DECODED JWT
      const userData = request.user;
      console.log(userData);

      // DECODE THE TOKEN TO GET THE TOURNAMENT DETAILS
      const { tournamentId } = request.decodedJWT;

      // FIND THE TOURNAMENT BY ID
      const tournament = await TournamentModel.findById(tournamentId);
      if (!tournament) {
        return response.status(404).json({ message: "Tournament not found" });
      }

      // CHECK IF THE USER IS ALREADY IN THE TOURNAMENT
      const isUserAlreadyInTournament = tournament.playerStats.some(
        (player) => player.userId.toString() === userData.id
      );

      if (isUserAlreadyInTournament) {
        return response
          .status(400)
          .json({ message: "User is already in the tournament!" });
      }

      // ADD THE USER TO THE TOURNAMENT'S PLAYER STATS
      const userPlayerStats = {
        userId: userData.id,
        player: userData.username,
        team: tournament.teams[0] || "",
        stats: tournament.gameStats.reduce((acc, stat) => {
          acc[stat] = 0;
          return acc;
        }, {}),
      };

      tournament.playerStats.push(userPlayerStats);
      await tournament.save();

      // REDIRECT THE USER TO THE TOURNAMENT PAGE
      response.redirect(`http://brawls.io/tournament/${tournamentId}`);
    } catch (error) {
      // HANDLE ANY ERRORS THAT OCCUR
      console.error("Error joining tournament:", error);
      next(error);
    }
  }
);

// CREATE TOURNAMENT VALIDATION
const validateTournament = [
  check("tournamentName")
    .isLength({ min: 3 })
    .withMessage("Tournament Name must be at least 3 letters long"),
  check("author")
    .isLength({ min: 3 })
    .withMessage("Author Name must be at least 3 letters long"),
  check("teams")
    .isArray({ max: 4 })
    .withMessage("Teams must be an array with a maximum of 4 elements"),
  check("game")
    .isLength({ min: 3 })
    .withMessage("Game must be at least 3 letters long"),
  check("gameStats")
    .isArray({ min: 2 })
    .withMessage("GameStats must be an array with at least 2 elements"),
  check("gameType").optional().isString(),
  check("description").optional().isString(),
  check("minimumPlayers")
    .isInt({ min: 2 })
    .withMessage("Minimum players must be at least 2"),
  check("maximumPlayers")
    .isInt({ max: 100 })
    .withMessage("Maximum players must be at most 100"),
  check("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 letters long"),
  check("isAuthorPlayer")
    .isBoolean()
    .withMessage("IsAuthorPlayer must be a boolean"),
];
// CREATE A TOURNAMENT
router.post(
  "/",
  userValidateJWTAndRefreshIt,
  validateTournament,
  async (request, response, next) => {
    console.log("in route");
    const errors = validationResult(request);

    // CHECK FOR ERRORS IN VALIDATION
    if (!errors.isEmpty()) {
      return response.status(400).json({ errors: errors.array() });
    }

    try {
      // GET ALL OF THE DATA FROM THE JSON BODY
      const {
        tournamentName,
        author,
        teams,
        game,
        gameStats,
        gameType,
        description,
        minimumPlayers,
        maximumPlayers,
        password,
        isAuthorPlayer,
      } = request.body;

      // GET THE DECODED AUTHOR ID FROM JWT FUNCTION
      const authorId = request.user.id;

      // ADD THE AUTHOR TO THE PLAYER ARRAY IF ISAUTHORPLAYER TRUE
      let playerStats = [];
      if (isAuthorPlayer) {
        const authorPlayerStats = {
          userId: authorId,
          player: author,
          team: teams[0] || "",
          stats: gameStats.reduce((acc, stat) => {
            acc[stat] = 0;
            return acc;
          }, {}),
        };
        playerStats.push(authorPlayerStats);
      }

      // ADD THE PLAYER TO THE FRONT OF THE TOURNAMENT GAMESTATS
      gameStats.unshift("player");

      // CREATE THE NEW TOURNAMENT MODEL INSTANCE
      const newTournament = new TournamentModel({
        tournamentName,
        authorId,
        author,
        teams,
        game,
        gameStats,
        gameType,
        description,
        minimumPlayers,
        maximumPlayers,
        password,
        playerStats,
      });

      // SAVE THE TOURNAMENT IN THE DATABASE
      const savedTournament = await newTournament.save();

      // CREATE THE JOIN GAME JWT WITH TOURNAMENT ID AND PASSWORD
      const joinLink = createJoinGameJWT({
        tournamentId: savedTournament._id,
        password,
      });

      // SAVE THE JOIN LINK TO THE TOURNAMENT
      savedTournament.joinlink = `https://brawlz.me/tournament/join/${joinLink}`;
      await savedTournament.save();

      // UPDATE THE USER'S DOCUMENT TO INCLUDE THIS TOURNAMENT
      await UserModel.findByIdAndUpdate(
        authorId,
        { $push: { tournaments: savedTournament._id } },
        { new: true }
      );

      response.json({
        message: "Tournament created successfully and added to user",
        tournament: savedTournament,
      });
    } catch (error) {
      console.error("Error creating tournament:", error);
      next(error);
    }
  }
);

const validateTournamentUpdate = [
  check("tournamentName")
    .optional()
    .isLength({ min: 3 })
    .withMessage("Tournament Name must be at least 3 letters long"),
  check("author")
    .optional()
    .isLength({ min: 3 })
    .withMessage("Author Name must be at least 3 letters long"),
  check("teams")
    .optional()
    .isArray({ max: 4 })
    .withMessage("Teams must be an array with a maximum of 4 elements"),
  check("game")
    .optional()
    .isLength({ min: 3 })
    .withMessage("Game must be at least 3 letters long"),
  check("gameStats")
    .optional()
    .isArray({ min: 2 })
    .withMessage("GameStats must be an array with at least 2 elements"),
  check("gameType").optional().isString(),
  check("description").optional().isString(),
  check("minimumPlayers")
    .optional()
    .isInt({ min: 2 })
    .withMessage("Minimum players must be at least 2"),
  check("maximumPlayers")
    .optional()
    .isInt({ max: 100 })
    .withMessage("Maximum players must be at most 100"),
  check("password")
    .optional()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 letters long"),
  check("isAuthorPlayer")
    .optional()
    .isBoolean()
    .withMessage("IsAuthorPlayer must be a boolean"),
];

// UPDATE A TOURNAMENT
router.patch(
  "/:id",
  userValidateJWTAndRefreshIt,
  validateTournamentUpdate,
  async (request, response, next) => {
    const errors = validationResult(request);

    // CHECK FOR ERRORS IN VALIDATION
    if (!errors.isEmpty()) {
      return response.status(400).json({ errors: errors.array() });
    }

    try {
      // GET THE TOURNAMENT ID FROM THE URL PARAMETERS
      const tournamentId = request.params.id;

      // FIND THE TOURNAMENT BY ID
      const tournament = await TournamentModel.findById(tournamentId);
      if (!tournament) {
        return response.status(404).json({ message: "Tournament not found" });
      }

      // CHECK IF THE USER IS THE AUTHOR OF THE TOURNAMENT
      if (tournament.authorId.toString() !== request.user.id) {
        return response
          .status(403)
          .json({ message: "User not authorized to update this tournament" });
      }

      // GET ALL OF THE DATA FROM THE REQUEST BODY
      const {
        tournamentName,
        author,
        teams,
        game,
        gameStats,
        gameType,
        description,
        minimumPlayers,
        maximumPlayers,
        password,
        isAuthorPlayer,
        playerStats,
      } = request.body;

      // UPDATE TOURNAMENT FIELDS IF THEY EXIST IN THE REQUEST BODY
      if (tournamentName) tournament.tournamentName = tournamentName;
      if (author) tournament.author = author;
      if (teams) tournament.teams = teams;
      if (game) tournament.game = game;
      if (gameStats) tournament.gameStats = gameStats;
      if (gameType) tournament.gameType = gameType;
      if (description) tournament.description = description;
      if (minimumPlayers) tournament.minimumPlayers = minimumPlayers;
      if (maximumPlayers) tournament.maximumPlayers = maximumPlayers;
      if (password) tournament.password = password;
      if (typeof isAuthorPlayer === "boolean")
        tournament.isAuthorPlayer = isAuthorPlayer;
      if (playerStats) {
        // UPDATE PLAYER STATS
        tournament.playerStats = playerStats.map((player) => ({
          ...player,
          stats: gameStats.reduce((acc, stat) => {
            acc[stat] = player.stats[stat] || 0;
            return acc;
          }, {}),
        }));
      }

      // SAVE THE UPDATED TOURNAMENT TO THE DATABASE
      const updatedTournament = await tournament.save();

      response.json({
        message: "Tournament updated successfully",
        tournament: updatedTournament,
      });
    } catch (error) {
      // HANDLE ANY ERRORS THAT OCCUR
      console.error("Error updating tournament:", error);
      next(error);
    }
  }
);

// DELETE A TOURNAMENT
router.delete("/:id", async (request, response, next) => {
  try {
    // FETCH TOURNAMENT ID FROM URL PARAMETERS
    const tournamentId = request.params.id;

    // FIND AND DELETE THE TOURNAMENT BY ITS ID
    const deletedTournament = await TournamentModel.findByIdAndDelete(
      tournamentId
    );

    // CHECK IF THE TOURNAMENT WAS FOUND AND DELETED
    if (!deletedTournament) {
      return response.status(404).json({ message: "Tournament not found" });
    }

    response.json({
      message: "Tournament successfully deleted",
      tournament: deletedTournament,
    });
  } catch (error) {
    // HANDLE ANY ERRORS THAT OCCUR
    console.error("Error deleting tournament:", error);
    next(error);
  }
});

module.exports = router;
