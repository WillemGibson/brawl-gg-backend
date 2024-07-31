const mongoose = require("mongoose");
const { TournamentModel } = require("../models/TournamentModel");
const { PlayerStatsModel } = require("../models/PlayerStatsModel");
const { UserModel } = require("../models/UserModel");
const { ChatsModel } = require("../models/ChatsModel");
const { databaseConnect, databaseClose, databaseClear } = require("./database");

const seedData = async () => {
  try {
    await databaseConnect();

    await databaseClear();

    // Create sample users
    const users = await UserModel.insertMany([
      {
        username: "player1",
        email: "player1@example.com",
        password: "password",
      },
      {
        username: "player2",
        email: "player2@example.com",
        password: "password",
      },
    ]);

    // Create sample player stats
    const playerStats = await PlayerStatsModel.insertMany([
      {
        playerId: users[0]._id,
        tournamentId: undefined,
        team: "Alpha",
        commonStats: {
          wins: 5,
          losses: 2,
          draws: 1,
          kills: 50,
          deaths: 20,
          assists: 30,
        },
        gameSpecificStats: { damageDealt: 5000, headshots: 20 },
      },
      {
        playerId: users[1]._id,
        tournamentId: undefined,
        team: "Bravo",
        commonStats: {
          wins: 3,
          losses: 4,
          draws: 1,
          kills: 30,
          deaths: 25,
          assists: 20,
        },
        gameSpecificStats: { damageDealt: 3000, headshots: 15 },
      },
    ]);

    // Create a sample tournament
    const tournament = new TournamentModel({
      tournamentName: "Apex Legends Championship",
      author: users[0]._id,
      game: "Apex Legends",
      gameType: "Battle Royale",
      description: "An exciting championship event for Apex Legends.",
      minimumPlayers: 2,
      maximumPlayers: 20,
      playerStats: playerStats.map((ps) => ps._id),
      users: users.map((u) => u._id),
      password: "securepass",
      joinlink: "http://example.com/join",
    });

    // Save the tournament and update player stats with the tournamentId
    await tournament.save();
    await PlayerStatsModel.updateMany(
      { _id: { $in: playerStats.map((ps) => ps._id) } },
      { $set: { tournamentId: tournament._id } }
    );

    // Create sample chats
    const chats = await ChatsModel.insertMany([
      {
        message: "Good luck everyone!",
        userId: users[0]._id,
        tournamentId: tournament._id,
      },
      {
        message: "Let's have a great game!",
        userId: users[1]._id,
        tournamentId: tournament._id,
      },
    ]);

    // Update tournament with chats
    tournament.chats = chats.map((chat) => chat._id);
    await tournament.save();

    console.log("Database seeded!");
    await databaseClose();
  } catch (error) {
    console.error(error);
  }
};

seedData();
