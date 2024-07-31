const { TournamentModel } = require("../models/TournamentModel");
const { UserModel } = require("../models/UserModel");
const { ChatsModel } = require("../models/ChatsModel");
const { databaseConnect, databaseClose, databaseClear } = require("./database");

const seedData = async () => {
  try {
    await databaseConnect();

    // Clear existing data
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

    // Create a sample tournament
    const tournament = new TournamentModel({
      tournamentName: "Apex Legends Championship",
      author: users[0]._id,
      game: "Apex Legends",
      gameType: "Battle Royale",
      description: "Apex Legends Tournament",
      minimumPlayers: 2,
      maximumPlayers: 20,
      password: "securepassword",
      joinlink: "http://example.com/join",
      users: users.map((u) => u._id),
      playerStats: [
        {
          playerName: users[0].username,
          userId: users[0]._id,
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
          playerName: users[1].username,
          userId: users[1]._id,
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
      ],
    });

    // Save the tournament
    await tournament.save();

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
    console.error("Error seeding data:", error);
  }
};

seedData();
