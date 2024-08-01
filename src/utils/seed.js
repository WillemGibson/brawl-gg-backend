const { TournamentModel } = require("../models/TournamentModel");
const { UserModel } = require("../models/UserModel");
const { ChatsModel } = require("../models/ChatsModel");
const { databaseConnect, databaseClose, databaseClear } = require("./database");

const seedData = async () => {
  try {
    await databaseConnect();

    // Create sample users
    const users = [
      {
        username: "player1",
        email: "player1@example.com",
        password: "securepassword1",
      },
      {
        username: "player2",
        email: "player2@example.com",
        password: "password",
      },
    ];

    // Create a sample tournament
    const tournament = new TournamentModel({
      tournamentName: "Apex Legends Championship",
      author: "66ab9b47e8ca0d8babefc4a1",
      teams: ["Alpha", "Bravo"],
      game: "Apex Legends",
      gameType: "Battle Royale",
      description: "Apex Legends Tournament",
      minimumPlayers: 2,
      maximumPlayers: 10,
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

    await UserModel.updateMany(
      { _id: { $in: "66ab9b47e8ca0d8babefc4a1" } },
      { $push: { tournaments: tournament._id } }
    );

    await tournament.save();

    console.log("Database seeded!");
    await databaseClose();
  } catch (error) {
    console.error("Error seeding data:", error);
  }
};

seedData();
