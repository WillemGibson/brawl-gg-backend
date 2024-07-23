const express = require("express");
const router = express.Router();

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
