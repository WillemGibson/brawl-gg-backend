const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { UserModel } = require("../models/UserModel");
const { TournamentModel } = require("../models/TournamentModel");
const { createTournament } = require("./createTournament");
const { databaseConnect, databaseClose, databaseClear } = require("./database");

const seedData = async () => {
  try {
    // Connect to the database
    await databaseConnect();

    // Clear existing data (optional, use if you want to start fresh)
    // await databaseClear();

    // Seed users
    const users = [
      {
        username: "username1",
        email: "user1@example.com",
        password: "securepassword",
        profileImage: "profile1.jpg",
        isAdmin: false,
      },
      {
        username: "username2",
        email: "user2@example.com",
        password: "securepassword",
        profileImage: "profile2.jpg",
        isAdmin: false,
      },
    ];

    const userDocs = await UserModel.insertMany(users);

    const user1_Id = userDocs[0]._id;
    const user2_Id = userDocs[1]._id;

    // Define tournament data
    const tournamentData = {
      tournamentName: "Apex Legends Championship",
      authorId: user1_Id,
      author: "Ben",
      teams: [""],
      gameStats: [
        "playerName",
        "wins",
        "losses",
        "draws",
        "kills",
        "deaths",
        "assists",
        "score",
      ],
      game: "Apex Legends",
      gameType: "Battle Royale",
      description: "Apex Legends Tournament",
      minimumPlayers: 2,
      maximumPlayers: 10,
      password: "securepassword",
      joinlink: "https://brawl.gg/join/:JWT",
      users: [user1_Id, user2_Id],
      playerStats: [
        {
          userId: user1_Id,
          playerName: "username1",
          team: "",
        },
        {
          userId: user2_Id,
          playerName: "username2",
          team: "",
        },
      ],
    };

    await createTournament(tournamentData);

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding data:", error);
  } finally {
    // Close the database connection
    await databaseClose();
  }
};

// Run the seed data function
seedData();
