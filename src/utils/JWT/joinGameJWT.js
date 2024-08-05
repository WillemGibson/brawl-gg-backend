const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const createJoinGameJWT = (tournamentDetailsToEncrypt) => {
  return jwt.sign(tournamentDetailsToEncrypt, process.env.JOIN_GAME_JWT_SECRET);
};

const validateJoinGameJWT = (request, response, next) => {
  const suppliedToken = request.params.token;
  console.log(suppliedToken);

  jwt.verify(
    suppliedToken,
    process.env.JOIN_GAME_JWT_SECRET,
    (error, decodedJWT) => {
      if (error) {
        console.error("Token verification failed:", error);
        return response
          .status(401)
          .json({ message: "User not authenticated." });
      }

      // Attach the decoded JWT to the request object
      request.decodedJWT = decodedJWT;
      next();
    }
  );
};

module.exports = {
  createJoinGameJWT,
  validateJoinGameJWT,
};
