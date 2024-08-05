const { TournamentModel } = require("../models/TournamentModel");

const createTournament = async (data) => {
  const initializedPlayerStats = data.playerStats.map((player) => {
    const stats = data.gameStats.reduce((acc, stat) => {
      acc[stat] = 0;
      return acc;
    }, {});
    return { ...player, stats };
  });

  const newTournament = new TournamentModel({
    ...data,
    playerStats: initializedPlayerStats,
  });

  try {
    const savedTournament = await newTournament.save();
    return savedTournament;
  } catch (error) {
    console.error("Error creating tournament:", error);
    throw error;
  }
};

module.exports = { createTournament };
