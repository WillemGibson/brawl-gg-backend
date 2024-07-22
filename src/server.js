const express = require("express");
const cors = require("cors");

// DECLARE THE EXPRESS APP
const app = express();

// ENABLE CORS FOR LOCAL ENVIROMENT
app.use(cors());

// ALLOWS JSON REQUESTS
app.use(express.json());

// ROUTES

// Home Route
app.get("/", (request, response, next) => {
  response.json({
    message: "Hello World",
  });
});

// 404 Handling Route
app.use((request, response) => {
  response.status(404).json({
    message: "404 Page Not Found!",
  });
});

// Error Handling Middleware
app.use((error, request, response, next) => {
  console.error(error.stack); // Log the error stack for debugging
  response.status(error.status || 500).json({
    message: "An error occurred",
    error: error.message,
  });
});

// Exporting the app
module.exports = {
  app,
};
