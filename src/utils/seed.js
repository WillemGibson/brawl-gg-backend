const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { UserModel } = require("../models/UserModel");
const { databaseConnect } = require("./database");

const seedData = async () => {
  try {
    await databaseConnect();

    const seedUser = {
      username: "admin",
      email: "admin@example.com",
      password: "password123",
    };

    const user = new UserModel(seedUser);
    await user.save();
    console.log("Seed user created:", user);
  } catch (error) {
    console.log(error);
  }
};

seedData();
