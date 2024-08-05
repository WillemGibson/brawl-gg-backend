const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

function createUserJWT(userDetailsToEncrypt) {
  return jwt.sign(userDetailsToEncrypt, process.env.USER_JWT_SECRET, {
    expiresIn: "7d",
  });
}

function userValidateJWTAndRefreshIt(request, response, next) {
  let suppliedToken = request.headers.jwt;

  jwt.verify(
    suppliedToken,
    process.env.USER_JWT_SECRET,
    (error, decodedJWT) => {
      if (error) {
        console.error("JWT Verification Error:", error.message);
        return response
          .status(401)
          .json({ message: "User not authenticated." });
      }

      // Store user details in the request object
      request.user = {
        id: decodedJWT.userId,
        isAdmin: decodedJWT.isAdmin,
      };

      // Create a fresh JWT
      let freshJWT = createUserJWT({
        userId: decodedJWT.userId,
        username: decodedJWT.username,
        password: decodedJWT.password,
        isAdmin: decodedJWT.isAdmin,
      });

      request.freshJWT = freshJWT;
      next();
    }
  );
}

module.exports = {
  createUserJWT,
  userValidateJWTAndRefreshIt,
};
