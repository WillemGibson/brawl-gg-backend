const express = require("express");
const cors = require("cors");

// DECLARE THE EXPRESS APP
const app = express();

// ENABLE CORS FOR LOCAL ENVIROMENT
app.use(cors());

// ALLOWS JSON REQUESTS
app.use(express.json());

// -------------------ROUTES ------------------------- //

// HOME ROUTE
app.get("/", (request, response, next) => {
  response.json({
    message: "Welcome to the Server :)",
  });
});

// LOGIN ROUTE
const LoginRouter = require("./controllers/LoginRouter");
app.use("/login", LoginRouter);

// USER ROUTES
const UserRouter = require("./controllers/UserRouter");
app.use("/user", UserRouter);

// TOURNAMENT ROUTES
const TournamentRouter = require("./controllers/TournamentRouter");
app.use("/tournament", TournamentRouter);

// 404 HANDLING ROUTE
app.use((request, response) => {
  response.status(404).json({
    message: "404 Page Not Found!",
  });
});

// ERROR HANDLING MIDDLWARE
app.use((error, request, response, next) => {
  console.error(error.stack); // Log the error stack for debugging
  response.status(error.status || 500).json({
    message: "An error occurred",
    error: error.message,
  });
});

// EXPORT THE APP
module.exports = {
  app,
};
